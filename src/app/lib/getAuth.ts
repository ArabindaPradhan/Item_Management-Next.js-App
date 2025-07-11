import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getAuth() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'object' && decoded !== null) {
      return {
        role: (decoded as any).role,
        permissions: (decoded as any).permissions || [],
      };
    }
  } catch (err) {
    console.error('Invalid JWT:', err);
  }

  return null;
}
