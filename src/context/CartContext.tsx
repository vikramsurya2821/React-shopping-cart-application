import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  Product,
  
} from "../types/Product";

import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "../services/cartService";

import type { CartItem } from "../services/cartService";

// =====================================
// USER TYPE
// =====================================

interface LoggedInUser {
  id: string | number;

  name?: string;

  email?: string;
}

// =====================================
// CONTEXT TYPE
// =====================================

interface CartContextType {
  cart: CartItem[];

  cartCount: number;

  totalPrice: number;

  addToCart: (
    product: Product
  ) => Promise<void>;

  removeFromCart: (
    cartItemId: string
  ) => Promise<void>;

  increase: (
    cartItemId: string
  ) => Promise<void>;

  decrease: (
    cartItemId: string
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  loadUserCart: () => Promise<void>;
}

// =====================================
// CREATE CONTEXT
// =====================================

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

// =====================================
// GET CURRENT USER
// =====================================

function getCurrentUser(): LoggedInUser | null {
  const savedUser =
    localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
}

// =====================================
// CART PROVIDER
// =====================================

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // =====================================
  // CART STATE
  // =====================================

  const [cart, setCart] =
    useState<CartItem[]>([]);

  // =====================================
  // LOAD CURRENT USER CART
  // =====================================

  const loadUserCart = async () => {
    const user = getCurrentUser();

    // NO USER
    if (!user) {
      setCart([]);
      return;
    }

    try {
      // API CALL
      const allCartItems =
        await getCart();

      // FILTER CURRENT USER CART
      const userCart =
        allCartItems.filter(
          (item:CartItem) =>
            String(item.userId) ===
            String(user.id)
        );

      // UPDATE STATE
      setCart(userCart);
    } catch (error) {
      console.error(
        "Error loading cart:",
        error
      );

      setCart([]);
    }
  };

  // =====================================
  // LOAD CART WHEN APP STARTS
  // =====================================

  useEffect(() => {
    loadUserCart();
  }, []);

  // =====================================
  // LOGIN / LOGOUT EVENT
  // =====================================

  useEffect(() => {
    const handleUserChanged = () => {
      loadUserCart();
    };

    window.addEventListener(
      "userChanged",
      handleUserChanged
    );

    return () => {
      window.removeEventListener(
        "userChanged",
        handleUserChanged
      );
    };
  }, []);

  // =====================================
  // ADD TO CART
  // =====================================

  const addToCart = async (
    product: Product
  ) => {
    const user = getCurrentUser();

    // USER NOT LOGGED IN
    if (!user) {
      alert(
        "Please login before adding to cart"
      );

      return;
    }

    try {
      // GET VARIANT ID
      const variantId =
        product.selectedVariant?.id ??
        "default";

      // UNIQUE CART ITEM ID
      const cartItemId =
        `${product.id}-${variantId}`;

      // FIND SAME USER + SAME VARIANT
      const existingItem =
        cart.find(
          (item) =>
            item.cartItemId ===
              cartItemId &&
            String(item.userId) ===
              String(user.id)
        );

      // SAME VARIANT
      // INCREASE QUANTITY
      if (existingItem) {
        const newQuantity =
          existingItem.quantity + 1;

        // API UPDATE
        await updateCartItem(
          existingItem.id,
          {
            quantity: newQuantity,
          }
        );

        // UPDATE STATE
        setCart((prev) =>
          prev.map((item) =>
            item.cartItemId ===
              cartItemId &&
            String(item.userId) ===
              String(user.id)
              ? {
                  ...item,
                  quantity: newQuantity,
                }
              : item
          )
        );

        return;
      }

      // DIFFERENT VARIANT
      // CREATE NEW CART ITEM
      const newCartItem: Omit<
        CartItem,
        "id"
      > = {
        ...product,

        cartItemId,

        quantity: 1,

        selectedVariant:
          product.selectedVariant ?? null,

        userId: user.id,
      };

      // API ADD
      const savedItem =
        await addCartItem(newCartItem);

      // UPDATE STATE
      setCart((prev) => [
        ...prev,
        savedItem,
      ]);
    } catch (error) {
      console.error(
        "Error adding cart:",
        error
      );
    }
  };

  // =====================================
  // REMOVE FROM CART
  // =====================================

  const removeFromCart = async (
    cartItemId: string
  ) => {
    const user = getCurrentUser();

    if (!user) {
      return;
    }

    // FIND ITEM
    const item = cart.find(
      (item) =>
        item.cartItemId ===
          cartItemId &&
        String(item.userId) ===
          String(user.id)
    );

    if (!item) {
      return;
    }

    try {
      // API DELETE
      await deleteCartItem(item.id);

      // UPDATE STATE
      setCart((prev) =>
        prev.filter(
          (cartItem) =>
            cartItem.cartItemId !==
              cartItemId
        )
      );
    } catch (error) {
      console.error(
        "Remove cart error:",
        error
      );
    }
  };

  // =====================================
  // INCREASE QUANTITY
  // =====================================

  const increase = async (
    cartItemId: string
  ) => {
    const user = getCurrentUser();

    if (!user) {
      return;
    }

    // FIND ITEM
    const item = cart.find(
      (item) =>
        item.cartItemId ===
          cartItemId &&
        String(item.userId) ===
          String(user.id)
    );

    if (!item) {
      return;
    }

    const newQuantity =
      item.quantity + 1;

    try {
      // API UPDATE
      await updateCartItem(item.id, {
        quantity: newQuantity,
      });

      // UPDATE STATE
      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem.cartItemId ===
            cartItemId
            ? {
                ...cartItem,
                quantity: newQuantity,
              }
            : cartItem
        )
      );
    } catch (error) {
      console.error(
        "Increase error:",
        error
      );
    }
  };

  // =====================================
  // DECREASE QUANTITY
  // =====================================

  const decrease = async (
    cartItemId: string
  ) => {
    const user = getCurrentUser();

    if (!user) {
      return;
    }

    // FIND ITEM
    const item = cart.find(
      (item) =>
        item.cartItemId ===
          cartItemId &&
        String(item.userId) ===
          String(user.id)
    );

    if (!item) {
      return;
    }

    const newQuantity =
      item.quantity - 1;

    try {
      // QUANTITY 0
      // DELETE ITEM
      if (newQuantity <= 0) {
        await deleteCartItem(item.id);

        setCart((prev) =>
          prev.filter(
            (cartItem) =>
              cartItem.cartItemId !==
                cartItemId
          )
        );

        return;
      }

      // API UPDATE
      await updateCartItem(item.id, {
        quantity: newQuantity,
      });

      // UPDATE STATE
      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem.cartItemId ===
            cartItemId
            ? {
                ...cartItem,
                quantity: newQuantity,
              }
            : cartItem
        )
      );
    } catch (error) {
      console.error(
        "Decrease error:",
        error
      );
    }
  };

  // =====================================
  // CLEAR CURRENT USER CART
  // =====================================

  const clearCart = async () => {
    const user = getCurrentUser();

    if (!user) {
      setCart([]);
      return;
    }

    try {
      // DELETE CURRENT USER CART ITEMS
      await Promise.all(
        cart
          .filter(
            (item) =>
              String(item.userId) ===
              String(user.id)
          )
          .map((item) =>
            deleteCartItem(item.id)
          )
      );

      // CLEAR STATE
      setCart([]);
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );
    }
  };

  // =====================================
  // CART COUNT
  // =====================================

  const cartCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  // =====================================
  // TOTAL PRICE
  // =====================================

  const totalPrice =
    cart.reduce(
      (total, item) =>
        total +
        (
          item.selectedVariant?.price ??
          item.price
        ) *
          item.quantity,
      0
    );

  // =====================================
  // PROVIDER
  // =====================================

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        totalPrice,
        addToCart,
        removeFromCart,
        increase,
        decrease,
        clearCart,
        loadUserCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =====================================
// CUSTOM HOOK
// =====================================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}