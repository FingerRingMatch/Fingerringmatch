import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const generateSignature = (razorpayOrderId: string, razorpayPaymentId: string) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET as string;
  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET is not defined");
  }

  return crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
};

export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      razorpayPaymentId,
      razorpaySignature,
      userId,
      maxConnections,
      name,
      price,
    } = await request.json();

    if (!userId) {
        return NextResponse.json(
          { message: "User ID is required", isOk: false },
          { status: 400 }
        );
      }
  

    // Generate the expected signature using your secret key
    const generatedSignature = generateSignature(orderId, razorpayPaymentId);

    // Compare the generated signature with the one received from Razorpay
    if (generatedSignature !== razorpaySignature) {
      console.warn(`Payment verification failed for order: ${orderId}`);
      return NextResponse.json(
        { message: "Payment verification failed", isOk: false },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
        where: { id: userId },
      });
  
      if (!existingUser) {
        return NextResponse.json(
          { message: "User not found", isOk: false },
          { status: 404 }
        );
      }

    // Create the subscription plan and update the user in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the subscription plan
      const subscriptionPlan = await prisma.subscriptionPlan.create({
        data: {
          orderId,
          razorpayPaymentId,
          razorpaySignature,
          timestamp: new Date(),
          status: "verified",
          name,
          price,
          duration: 3, // Set default duration (3 months)
          maxConnections,
         discount: '50% off',
        },
      });

      // Update the user with the subscription plan
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlanId: subscriptionPlan.id,
          subscriptionExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        },
      });

      return { subscriptionPlan, updatedUser };
    });

    return NextResponse.json(
      {
        message: "Payment verified successfully",
        isOk: true,
        razorpayPaymentId,
        razorpaySignature,
        orderId,
        subscriptionPlan: result.subscriptionPlan,
        user: result.updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error", isOk: false },
      { status: 500 }
    );
  }
}