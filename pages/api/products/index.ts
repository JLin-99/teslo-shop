import { NextApiRequest, NextApiResponse } from "next";

import { db, SHOP_CONSTANTS } from "@/database";
import { Product } from "@/models";
import { IProduct } from "@/interfaces";

type Data = { message: string } | IProduct[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);

    default:
      return res.status(400).json({
        message: "Bad request",
      });
  }

  res.status(200).json({ message: "Example" });
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender } = req.query;

  let condition = {};
  if (gender && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
    condition = { gender };
  }

  await db.connect();
  const products = await Product.find(condition)
    .select("title images price inStock slug -_id")
    .lean()
    .exec();

  await db.disconnect();

  return res.status(200).json(products);
};
