import request from "./apiClient";

import type { Order } from "../types/Order";

// =====================================
// GET ALL ORDERS
// =====================================

export function getOrders(): Promise<Order[]> {
  return request<Order[]>("/orders");
}

// =====================================
// GET CURRENT USER ORDERS
// =====================================

export function getUserOrders(
  userId: number | string
): Promise<Order[]> {
  return request<Order[]>(
    `/orders?userId=${userId}`
  );
}

// =====================================
// CREATE ORDER
// =====================================

export function createOrder(
  order: Omit<Order, "id">
): Promise<Order> {
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

// =====================================
// GET ORDER BY ID
// =====================================

export function getOrderById(
  id: number
): Promise<Order> {
  return request<Order>(
    `/orders/${id}`
  );
}

// =====================================
// UPDATE ORDER STATUS
// =====================================

export function updateOrderStatus(
  id: number,
  status: string
): Promise<Order> {
  return request<Order>(
    `/orders/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    }
  );
}