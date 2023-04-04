import { createContext } from "react";

import { ICartProduct } from "@/interfaces";

interface ContextProps {
  cart: ICartProduct[];

  addProductToCart: (product: ICartProduct) => void;
  updateProductQuantity: (product: ICartProduct) => void;
  removeProduct: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps);
