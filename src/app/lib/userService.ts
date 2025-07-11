import User from "../models/User";

export async function getUserByEmail(email: string) {
  return await User.findOne({ email });
}

export async function createUser(userData: { name: string; email: string; password: string }) {
  return await User.create(userData);
}
