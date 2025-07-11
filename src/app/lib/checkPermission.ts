import { getAuth } from './getAuth';

export async function hasPermission(required: string): Promise<boolean> {
  const auth = await getAuth();

  if (!auth) {
    console.warn('No auth found');
    return false;
  }

  if (auth.role === 'admin') {
    return true; // ✅ Admin override
  }

  return auth.permissions.includes(required);
}
