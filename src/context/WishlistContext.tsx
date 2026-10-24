import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Product } from "../types/Product";

import { useAuth } from "./AuthContext";

import {
  getWishlist,
  addWishlistItem,
  deleteWishlistItem,
} from "../services/wishlistService";

import type {
  WishlistItem,
} from "../services/wishlistService";

// =====================================
// CONTEXT TYPE
// =====================================

interface WishlistContextType {
  wishlist: WishlistItem[];

  loading: boolean;

  addToWishlist: (
    product: Product
  ) => Promise<void>;

  removeFromWishlist: (
    productId: number
  ) => Promise<void>;

  isInWishlist: (
    productId: number
  ) => boolean;
}

// =====================================
// CREATE CONTEXT
// =====================================

const WishlistContext =
  createContext<
    WishlistContextType | undefined
  >(undefined);

// =====================================
// WISHLIST PROVIDER
// =====================================

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user } = useAuth();

  // =====================================
  // STATE
  // =====================================

  const [wishlist, setWishlist] =
    useState<WishlistItem[]>([]);

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // LOAD CURRENT USER WISHLIST
  // =====================================

  useEffect(() => {

    const loadWishlist = async () => {

      // USER NOT LOGGED IN
      if (!user) {
        setWishlist([]);
        return;
      }

      try {

        setLoading(true);

        // API SERVICE CALL
        const data =
          await getWishlist(user.id);

        setWishlist(data);

      } catch (error) {

        console.error(
          "Wishlist load error:",
          error
        );

        setWishlist([]);

      } finally {

        setLoading(false);

      }
    };

    loadWishlist();

  }, [user]);

  // =====================================
  // ADD TO WISHLIST
  // =====================================

  const addToWishlist = async (
    product: Product
  ) => {

    // USER NOT LOGGED IN
    if (!user) {
      alert(
        "Please login to add products to wishlist"
      );

      return;
    }

    // CHECK ALREADY EXISTS
    const alreadyExists =
      wishlist.some(
        (item) =>
          item.productId === product.id
      );

    if (alreadyExists) {
      return;
    }

    try {

      const wishlistData: Omit<
        WishlistItem,
        "id"
      > = {
        userId: user.id,

        productId: product.id,

        product: product,
      };

      // API SERVICE CALL
      const newWishlistItem =
        await addWishlistItem(
          wishlistData
        );

      // UPDATE STATE
      setWishlist((prev) => [
        ...prev,
        newWishlistItem,
      ]);

    } catch (error) {

      console.error(
        "Wishlist add error:",
        error
      );
    }
  };

  // =====================================
  // REMOVE FROM WISHLIST
  // =====================================

  const removeFromWishlist = async (
    productId: number
  ) => {

    const wishlistItem =
      wishlist.find(
        (item) =>
          item.productId === productId
      );

    if (!wishlistItem) {
      return;
    }

    try {

      // API SERVICE CALL
      await deleteWishlistItem(
        wishlistItem.id
      );

      // UPDATE STATE
      setWishlist((prev) =>
        prev.filter(
          (item) =>
            item.productId !== productId
        )
      );

    } catch (error) {

      console.error(
        "Wishlist remove error:",
        error
      );
    }
  };

  // =====================================
  // CHECK PRODUCT
  // =====================================

  const isInWishlist = (
    productId: number
  ): boolean => {

    return wishlist.some(
      (item) =>
        item.productId === productId
    );
  };

  // =====================================
  // PROVIDER
  // =====================================

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// =====================================
// CUSTOM HOOK
// =====================================

export function useWishlist() {

  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}