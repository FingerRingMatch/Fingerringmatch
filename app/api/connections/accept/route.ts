import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { requestId } = req.body;

    try {
      // Find the connection request
      const connectionRequest = await prisma.connectionRequest.findUnique({
        where: { id: requestId },
      });

      if (!connectionRequest) {
        return res.status(404).json({ error: 'Connection request not found' });
      }

      // Update the request status to accepted
      await prisma.connectionRequest.update({
        where: { id: requestId },
        data: { status: 'accepted' },
      });

      // Optionally, you can update the connection count of both users here
      const { fromUserId, toUserId } = connectionRequest;

      await prisma.user.updateMany({
        where: { id: { in: [fromUserId, toUserId] } },
        data: { connectionsMade: { increment: 1 } },
      });

      res.status(200).json({ message: 'Connection request accepted' });
    } catch (error) {
      console.error('Error accepting connection request:', error);
      res.status(500).json({ error: 'Failed to accept connection request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
