import { createContext } from "react";

import { ICartProduct } from "@/interfaces";

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  addProductToCart: (product: ICartProduct) => void;
  updateProductQuantity: (product: ICartProduct) => void;
  removeProduct: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps);
