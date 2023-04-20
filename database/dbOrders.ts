import { isValidObjectId } from "mongoose";

import { db } from ".";
import { Order } from "@/models";
import { IOrder } from "@/interfaces";

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  if (!isValidObjectId(id)) {
    return null;
  }

  await db.connect();
  const order = await Order.findById(id).lean().exec();
  await db.disconnect();

  if (!order) {
    return null;
  }

  order.orderItems = order.orderItems.map((item) => {
    item.image = item.image.includes("http")
      ? item.image
      : `${process.env.HOST_NAME}products/${item.image}`;
    return item;
  });

  return JSON.parse(JSON.stringify(order));
};

export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  if (!isValidObjectId(userId)) {
    return [];
  }

  await db.connect();
  const orders = await Order.find({ user: userId }).lean().exec();
  await db.disconnect();

  return JSON.parse(JSON.stringify(orders));
};
