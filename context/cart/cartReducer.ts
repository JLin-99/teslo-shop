import { ICartProduct } from "@/interfaces";
import { CartState } from "./CartProvider";

type CartActionType =
  | { type: "[CART] - Load Cart"; payload: ICartProduct[] }
  | { type: "[CART] - Add Product"; payload: ICartProduct };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[CART] - Load Cart":
      return {
        ...state,
      };
    default:
      return state;
  }
};
