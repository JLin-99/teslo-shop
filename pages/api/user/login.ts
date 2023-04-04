import { NextApiRequest, NextApiResponse } from "next";

import bcrypt from "bcryptjs";

import { User } from "@/models";
import { db } from "@/database";
import { jwt } from "@/utils";

type Data =
  | { message: string }
  | {
      token: string;
      user: {
        email: string;
        name: string;
        role: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return loginUser(req, res);

    default:
      res.status(400).json({
        message: "Bad request",
      });
  }
}

async function loginUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email = "", password = "" } = req.body;

  await db.connect();
  const user = await User.findOne({ email }).lean().exec();
  await db.disconnect();

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const { _id, role, name } = user;

  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  });
}
