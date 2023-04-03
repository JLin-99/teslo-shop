import { db } from ".";
import { Product } from "@/models";
import { IProduct } from "@/interfaces";

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  if (!product) {
    return null;
  }

  return JSON.parse(JSON.stringify(product));
};

interface ProductSlug {
  slug: string;
}

export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
  await db.connect();
  const slugs = await Product.find().select("slug -_id").lean();
  await db.disconnect();

  return slugs;
};

export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
  term = term.toString().toLowerCase();
  const regex = new RegExp(term as string, "i");

  await db.connect();
  const products = await Product.find({
    $or: [{ title: regex }, { tags: { $in: [regex] } }],
  })
    .select("title images price inStock slug -_id")
    .lean();

  await db.disconnect();

  return products;
};
