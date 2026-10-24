export interface OrderItem {
  productId: string | number;

  name: string;

  category: string;

  price: number;

  brand: string;

  rating: number;

  discount: number;

  description: string;

  image?: string;

  quantity: number;
}

export interface Order {
  id: string | number;

  userId: string | number;

  userName: string;

  userEmail: string;

  items: OrderItem[];

  total: number;

  date: string;

  status: string;
}