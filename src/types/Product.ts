// export interface Product {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
//   brand: string;
//   rating: number;
//   discount: number;
//   description: string;
//   image?: string;
// }

// export interface CartItem extends Product {
//   quantity: number;

//   // எந்த user-க்கு இந்த cart item என்று identify செய்ய
//   userId: string | number;
//   // Original product ID
//   productId?: number;
// }
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
  rating: number;
  discount: number;
  description: string;
  image?: string;
  variants?: ProductVariant[];
  selectedVariant?: ProductVariant | null;
}

export interface CartItem extends Product {
  quantity: number;

  // Actual product ID
  productId?: number;

  // Current user ID
  userId?: string | number;
}
export interface ProductVariant {
  id: string;
  ram?: string;
  storage?: string;
    size?: string;

  color?: string;
  price: number;
  stock: number;
}