import type {

  CartItem,
} from "../types/Product";

export type CartAction =
  | {
      type: "SET_CART";
      payload: CartItem[];
    }
  | {
      type: "ADD_TO_CART";
      payload: CartItem;
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: number;
    }
  | {
      type: "INCREASE";
      payload: number;
    }
  | {
      type: "DECREASE";
      payload: number;
    }
  | {
      type: "CLEAR_CART";
    };

export const cartReducer = (
  state: CartItem[],
  action: CartAction
): CartItem[] => {
  switch (action.type) {
    // ===============================
    // LOAD CURRENT USER CART
    // ===============================

    case "SET_CART":
      return action.payload;

    // ===============================
    // ADD TO CART
    // ===============================

    case "ADD_TO_CART": {
      const existingProduct = state.find(
        (item) =>
          item.id === action.payload.id
      );

      if (existingProduct) {
        return state.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...state,
        action.payload,
      ];
    }

    // ===============================
    // REMOVE
    // ===============================

    case "REMOVE_FROM_CART":
      return state.filter(
        (item) =>
          item.id !== action.payload
      );

    // ===============================
    // INCREASE
    // ===============================

    case "INCREASE":
      return state.map((item) =>
        item.id === action.payload
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      );

    // ===============================
    // DECREASE
    // ===============================

    case "DECREASE":
      return state
        .map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        );

    // ===============================
    // CLEAR
    // ===============================

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};