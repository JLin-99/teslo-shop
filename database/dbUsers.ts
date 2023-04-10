import bcrypt from "bcryptjs";
import { User } from "@/models";
import { db } from ".";

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  await db.connect();
  const user = await User.findOne({ email }).lean().exec();
  await db.disconnect();

  if (!user) return null;
  if (bcrypt.compareSync(password, user.password!)) return null;

  const { role, name, _id } = user;

  return { id: _id, email: email.toLocaleLowerCase(), role, name };
};
