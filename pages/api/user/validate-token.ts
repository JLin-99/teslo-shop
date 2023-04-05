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
    case "GET":
      return checkJWT(req, res);

    default:
      res.status(400).json({
        message: "Bad request",
      });
  }
}

async function checkJWT(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { token = "" } = req.cookies;

  let userId = "";

  try {
    userId = await jwt.isValidToken(token);
  } catch {
    return res.status(401).json({
      message: "Invalid authorization token",
    });
  }

  await db.connect();
  const user = await User.findById(userId).lean().exec();
  await db.disconnect();

  if (!user) {
    return res.status(400).json({ message: "No user" });
  }

  const { _id, email, role, name } = user;

  return res.status(200).json({
    token: jwt.signToken(_id, email),
    user: {
      email,
      role,
      name,
    },
  });
}
