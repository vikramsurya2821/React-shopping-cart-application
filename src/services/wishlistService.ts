import request from "./apiClient";

import type { Product } from "../types/Product";

// =====================================
// WISHLIST ITEM TYPE
// =====================================

export interface WishlistItem {
  id: string | number;

  userId: string | number;

  productId: number;

  product: Product;
}

// =====================================
// GET USER WISHLIST
// =====================================

export function getWishlist(
  userId: string | number
): Promise<WishlistItem[]> {
  return request<WishlistItem[]>(
    `/wishlist?userId=${userId}`
  );
}

// =====================================
// ADD TO WISHLIST
// =====================================

export function addWishlistItem(
  item: Omit<WishlistItem, "id">
): Promise<WishlistItem> {
  return request<WishlistItem>("/wishlist", {
    method: "POST",

    body: JSON.stringify(item),
  });
}

// =====================================
// DELETE WISHLIST ITEM
// =====================================

export function deleteWishlistItem(
  id: string | number
): Promise<void> {
  return request<void>(`/wishlist/${id}`, {
    method: "DELETE",
  });
}