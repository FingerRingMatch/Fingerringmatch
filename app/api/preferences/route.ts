// pages/api/preferences.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Adjust the import based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, preferredGender, minAge, maxAge, minHeight, maxHeight, preferredReligion, preferredDiet } = req.body as {
      userId: string;
      preferredGender: string;
      minAge: number;
      maxAge: number;
      minHeight: number;
      maxHeight: number;
      preferredReligion: string;
      preferredDiet: string;
    };

    try {
      const preferences = await prisma.preferences.create({
        data: {
          userId,
          preferredGender,
          minAge,
          maxAge,
          minHeight,
          maxHeight,
          preferredReligion,
          preferredDiet,
        },
      });
      return res.status(201).json(preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      return res.status(500).json({ error: 'Failed to save preferences' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
