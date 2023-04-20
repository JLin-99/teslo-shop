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

  product.images = product.images.map((image) => {
    return image.includes("http")
      ? image
      : `${process.env.HOST_NAME}products/${image}`;
  });

  return JSON.parse(JSON.stringify(product));
};

interface ProductSlug {
  slug: string;
}

export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
  await db.connect();
  const slugs = await Product.find().select("slug -_id").lean().exec();
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

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });

    return product;
  });

  return updatedProducts;
};

export const getAllProducts = async (): Promise<ProductSlug[]> => {
  await db.connect();
  const products = await Product.find().lean().exec();
  await db.disconnect();

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });

  return JSON.parse(JSON.stringify(updatedProducts));
};
