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
      return registerUser(req, res);

    default:
      res.status(400).json({
        message: "Bad request",
      });
  }
}

async function registerUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const {
    email = "",
    password = "",
    name = "",
  } = req.body as { email: string; password: string; name: string };

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }

  if (name.length < 3 || name.length > 50) {
    return res.status(400).json({
      message: "Name must be at least 2 and a max of 50 characters long",
    });
  }

  await db.connect();
  const user = await User.findOne({ email }).lean().exec();

  if (user) {
    await db.disconnect();
    return res.status(400).json({
      message: "Email already in use",
    });
  }

  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role: "client",
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
    await db.disconnect();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Check server logs",
    });
  }

  const { _id, role } = newUser;

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
