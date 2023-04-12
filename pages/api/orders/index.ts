import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { IOrder } from "../../../interfaces";
import { db } from "@/database";
import { Order, Product } from "@/models";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";

type Data = { message: string } | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  // const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Need to be authenticated" });
  }

  const productsIds = orderItems.map((product) => product._id);
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsIds } })
    .lean()
    .exec();

  try {
    const backendSubTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (prod) =>
          new mongoose.Types.ObjectId(prod._id).toString() === current._id
      )!.price;
      if (!currentPrice) {
        throw new Error("Verify your cart, product does not exists");
      }

      return currentPrice * current.quantity + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = backendSubTotal * (taxRate + 1);

    if (total !== backendTotal) {
      throw new Error("Total does not match");
    }

    const userId = session.user.id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    await newOrder.save();
    await db.disconnect();

    return res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
      message: error.message || "Check server logs",
    });
  }
};
