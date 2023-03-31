import type { NextApiRequest, NextApiResponse } from "next";

import { db } from "@/database";
import { IProduct } from "@/interfaces";
import { Product } from "@/models";

type Data = { message: string } | IProduct[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return searchProducts(req, res);

    default:
      return res.status(400).json({
        message: "Bad request",
      });
  }
}

const searchProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let { query = "" } = req.query;

  if (!query.length) {
    return res.status(400).json({
      message: "Specify search query",
    });
  }

  query = query.toString().toLowerCase();
  const regex = new RegExp(query as string, "i");

  await db.connect();
  const products = await Product.find({
    $or: [{ title: regex }, { tags: { $in: [regex] } }],
  })
    .select("title images price inStock slug -_id")
    .lean();

  await db.disconnect();

  return res.status(200).json(products);
};
