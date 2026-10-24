import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import type { Product } from "../types/Product";

import { getProducts } from "../services/productService";

import { useCart } from "../context/CartContext";

import ProductCard from "../components/ProductCard";

import Sidebar from "../components/Sidebar";

// import "./Products.css";

function Products() {

  // =========================
  // PRODUCTS
  // =========================

  const [products, setProducts] =
    useState<Product[]>([]);

  // =========================
  // SEARCH
  // =========================

  const [search, setSearch] =
    useState("");

  // =========================
  // CATEGORY
  // =========================

  const [category, setCategory] =
    useState("All");

  // =========================
  // SORT
  // =========================

  const [sort, setSort] =
    useState("default");

  // =========================
  // PRICE
  // =========================

  const [maxPrice, setMaxPrice] =
    useState(500000);

  // =========================
  // RATING
  // =========================

  const [minRating, setMinRating] =
    useState(0);

  // =========================
  // LOADING
  // =========================

  const [loading, setLoading] =
    useState(true);

  // =========================
  // ERROR
  // =========================

  const [error, setError] =
    useState("");

  // =========================
  // useRef
  // =========================

  const searchRef =
    useRef<HTMLInputElement>(null);

  // =========================
  // CART
  // =========================

  const { addToCart } =
    useCart();

  // =========================
  // NAVIGATION
  // =========================

  const navigate =
    useNavigate();

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);

        setError("");

        // GET PRODUCTS FROM PRODUCT SERVICE
        const data = await getProducts();

        console.log(
          "TOTAL JSON PRODUCTS:",
          data.length
        );

        setProducts(data);

      } catch (error) {

        console.error(error);

        setError(
          "Unable to load products"
        );

      } finally {

        setLoading(false);

      }
    };

    fetchProducts();

  }, []);

  // =========================
  // CATEGORIES
  // =========================

  const categories = useMemo(() => {

    const categoryList =
      products.map(
        (product) =>
          product.category
      );

    return [
      "All",
      ...new Set(categoryList),
    ];

  }, [products]);

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredProducts =
    useMemo(() => {

      let result =
        products.filter(
          (product) => {

            // SEARCH
            const searchMatch =
              product.name
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||
              product.brand
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                );

            // CATEGORY
            const categoryMatch =
              category === "All" ||
              product.category ===
                category;

            // PRICE
            const priceMatch =
              product.price <=
              maxPrice;

            // RATING
            const ratingMatch =
              product.rating >=
              minRating;

            return (
              searchMatch &&
              categoryMatch &&
              priceMatch &&
              ratingMatch
            );
          }
        );

      // =========================
      // SORT
      // =========================

      if (sort === "low") {

        result.sort(
          (a, b) =>
            a.price - b.price
        );
      }

      if (sort === "high") {

        result.sort(
          (a, b) =>
            b.price - a.price
        );
      }

      if (sort === "rating") {

        result.sort(
          (a, b) =>
            b.rating - a.rating
        );
      }

      if (sort === "discount") {

        result.sort(
          (a, b) =>
            b.discount -
            a.discount
        );
      }

      console.log(
        "TOTAL:",
        products.length
      );

      console.log(
        "FILTERED:",
        result.length
      );

      console.log(
        "MAX PRICE:",
        maxPrice
      );

      return result;

    }, [
      products,
      search,
      category,
      maxPrice,
      minRating,
      sort,
    ]);

  // =========================
  // SEARCH FOCUS
  // =========================

  const focusSearch = () => {

    searchRef.current?.focus();

  };

  // =========================
  // PRODUCT DETAILS
  // =========================

  const viewDetails = (
    id: number
  ) => {

    navigate(
      `/products/${id}`
    );

  };

  // =========================
  // CLEAR ALL FILTERS
  // =========================

  const clearAllFilters = () => {

    setSearch("");

    setCategory("All");

    setMaxPrice(500000);

    setMinRating(0);

    setSort("default");

  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="products-loading">

        <h2>
          Loading products...
        </h2>

      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {

    return (
      <div className="products-error">

        <h2>
          {error}
        </h2>

        <p>
          Make sure JSON Server is
          running on port 3000.
        </p>

        <code>
          npm start
        </code>

      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <div className="products-page">

      {/* ================= HEADER ================= */}

      <header className="products-header">

        <div className="logo">
          🛒 BuyNest
        </div>

        {/* SEARCH */}

        <div className="search-container">

          <input
            ref={searchRef}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          <button
            type="button"
            onClick={focusSearch}
          >
            🔍
          </button>

        </div>

        {/* HEADER LINKS */}

        <div className="header-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/cart">
            🛒 Cart
          </Link>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <div className="products-layout">

        {/* ================= SIDEBAR ================= */}

        <Sidebar
          categories={categories}
          category={category}
          setCategory={setCategory}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minRating={minRating}
          setMinRating={setMinRating}
        />

        {/* ================= PRODUCTS ================= */}

        <main className="products-content">

          {/* TOP BAR */}

          <div className="products-topbar">

            <div>

              <h1>
                All Products
              </h1>

              <p>
                {filteredProducts.length}{" "}
                products found
              </p>

            </div>

            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
            >

              <option value="default">
                Sort By
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>

              <option value="rating">
                Rating
              </option>

              <option value="discount">
                Discount
              </option>

            </select>

          </div>

          {/* ================= PRODUCT GRID ================= */}

          {filteredProducts.length === 0 ? (

            <div className="no-products">

              <div>
                🔍
              </div>

              <h2>
                No products found
              </h2>

              <p>
                Try changing your
                filters or search.
              </p>

              <button
                type="button"
                onClick={
                  clearAllFilters
                }
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <div className="product-grid">

              {filteredProducts.map(
                (product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={
                      addToCart
                    }
                    viewDetails={
                      viewDetails
                    }
                  />

                )
              )}

            </div>

          )}

        </main>

      </div>

    </div>
  );
}

export default Products;