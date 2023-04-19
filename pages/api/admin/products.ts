import type { NextApiRequest, NextApiResponse } from "next";

import { isValidObjectId } from "mongoose";

import { db } from "@/database";
import { IProduct } from "@/interfaces";
import { Product } from "@/models";

type Data = { message: string } | IProduct[] | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);

    case "PUT":
      return updateProduct(req, res);

    case "POST":
    //   return createProduct(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await Product.find().sort({ title: "asc" }).lean().exec();
  await db.disconnect();

  res.status(200).json(products);
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: "The product id is invalid" });
  }

  if (images.length < 2) {
    return res.status(400).json({ message: "At least 2 images are required" });
  }

  try {
    await db.connect();
    const product = await Product.findById(_id).exec();
    if (!product) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: "There is no product with that id" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    await db.disconnect();

    if (!updateProduct) {
      return res
        .status(400)
        .json({ message: "Failed to update product with id: " + _id });
    }

    return res.status(200).json(updatedProduct!);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(400).json({ message: "Check server console/log" });
  }
};
