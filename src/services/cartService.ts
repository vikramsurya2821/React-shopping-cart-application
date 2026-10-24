import request from "./apiClient";

import type {
  Product,
  ProductVariant,
} from "../types/Product";

// =====================================
// CART ITEM
// =====================================

export interface CartItem extends Product {
  cartItemId: string;

  quantity: number;

  selectedVariant?: ProductVariant | null;

  userId: string | number;
}

// =====================================
// GET CART
// =====================================

export function getCart(): Promise<CartItem[]> {
  return request<CartItem[]>("/cart");
}

// =====================================
// ADD CART ITEM
// =====================================

export function addCartItem(
  item: Omit<CartItem, "id">
): Promise<CartItem> {
  return request<CartItem>("/cart", {
    method: "POST",

    body: JSON.stringify(item),
  });
}

// =====================================
// UPDATE CART ITEM
// =====================================

export function updateCartItem(
  id: string | number,
  data: Partial<CartItem>
): Promise<CartItem> {
  return request<CartItem>(`/cart/${id}`, {
    method: "PATCH",

    body: JSON.stringify(data),
  });
}

// =====================================
// DELETE CART ITEM
// =====================================

export function deleteCartItem(
  id: string | number
): Promise<void> {
  return request<void>(`/cart/${id}`, {
    method: "DELETE",
  });
}