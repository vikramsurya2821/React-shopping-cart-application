import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import type { Product } from "../types/Product";

import useApi from "../hooks/useApi";
import { getProducts } from "../services/productService";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import FilterSidebar from "../components/dashboard/FilterSidebar";
import ProductsHeader from "../components/dashboard/ProductsHeader";
import ProductGrid from "../components/dashboard/ProductGrid";

function Dashboard() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    addToCart,
    cartCount,
  } = useCart();

  // API

  const {
    data: productsData,
    loading,
    error,
    callAPI: fetchProducts,
  } = useApi(getProducts);

  // SEARCH

  const [search, setSearch] = useState("");

  // CATEGORY

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState<string[]>([]);

  // BRAND

  const [
    selectedBrands,
    setSelectedBrands,
  ] = useState<string[]>([]);

  // PRICE

  const [minPrice, setMinPrice] = useState("");

  const [maxPrice, setMaxPrice] = useState("");

  // SORT

  const [sort, setSort] =
    useState("default");

  // PRODUCTS

  const products = productsData ?? [];

  // =====================================
  // FETCH PRODUCTS
  // =====================================

  useEffect(() => {
    fetchProducts().catch((error) => {
      console.error(
        "Products loading error:",
        error
      );
    });
  }, [fetchProducts]);

  // =====================================
  // CATEGORIES
  // =====================================

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    ).sort();
  }, [products]);

  // =====================================
  // BRANDS
  // =====================================

  const brands = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.brand)
          .filter(Boolean)
      )
    ).sort();
  }, [products]);

  // =====================================
  // CATEGORY CHANGE
  // =====================================

  const handleCategoryChange = (
    category: string
  ) => {
    setSelectedCategories(
      (previousCategories) => {

        if (
          previousCategories.includes(
            category
          )
        ) {
          return previousCategories.filter(
            (item) => item !== category
          );
        }

        return [
          ...previousCategories,
          category,
        ];
      }
    );
  };

  // =====================================
  // BRAND CHANGE
  // =====================================

  const handleBrandChange = (
    brand: string
  ) => {
    setSelectedBrands(
      (previousBrands) => {

        if (
          previousBrands.includes(
            brand
          )
        ) {
          return previousBrands.filter(
            (item) => item !== brand
          );
        }

        return [
          ...previousBrands,
          brand,
        ];
      }
    );
  };

  // =====================================
  // FILTER PRODUCTS
  // =====================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH

    if (search.trim()) {
      const searchValue =
        search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(searchValue) ||
          product.brand
            .toLowerCase()
            .includes(searchValue) ||
          product.category
            .toLowerCase()
            .includes(searchValue)
      );
    }

    // CATEGORY

    if (
      selectedCategories.length > 0
    ) {
      result = result.filter(
        (product) =>
          selectedCategories.includes(
            product.category
          )
      );
    }

    // BRAND

    if (
      selectedBrands.length > 0
    ) {
      result = result.filter(
        (product) =>
          selectedBrands.includes(
            product.brand
          )
      );
    }

    // MIN PRICE

    if (minPrice !== "") {
      result = result.filter(
        (product) =>
          product.price >=
          Number(minPrice)
      );
    }

    // MAX PRICE

    if (maxPrice !== "") {
      result = result.filter(
        (product) =>
          product.price <=
          Number(maxPrice)
      );
    }

    // LOW TO HIGH

    if (sort === "low") {
      result.sort(
        (a, b) =>
          a.price - b.price
      );
    }

    // HIGH TO LOW

    if (sort === "high") {
      result.sort(
        (a, b) =>
          b.price - a.price
      );
    }

    // RATING

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          b.rating - a.rating
      );
    }

    return result;

  }, [
    products,
    search,
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    sort,
  ]);

  // =====================================
  // CLEAR FILTERS
  // =====================================

  const clearFilters = () => {
    setSearch("");

    setSelectedCategories([]);

    setSelectedBrands([]);

    setMinPrice("");

    setMaxPrice("");

    setSort("default");
  };

  // =====================================
  // VIEW PRODUCT
  // =====================================

  const viewProduct = (
    id: number
  ) => {
    navigate(`/product/${id}`);
  };

  // =====================================
  // ADD TO CART
  // =====================================

  const handleAddToCart = (
    product: Product
  ) => {
    addToCart(product);
  };

  return (
    <div className="min-vh-100 bg-light">

      {/* HEADER */}

      <DashboardHeader
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        user={user}
      />

      {/* MAIN */}

      <main>

        <Container
          fluid
          className="py-4"
        >

          <Row className="g-4">

            {/* FILTER */}

            <Col
              xs={12}
              lg={3}
              xl={2}
            >

              <FilterSidebar
                categories={categories}
                brands={brands}
                selectedCategories={
                  selectedCategories
                }
                selectedBrands={
                  selectedBrands
                }
                minPrice={minPrice}
                maxPrice={maxPrice}
                onCategoryChange={
                  handleCategoryChange
                }
                onBrandChange={
                  handleBrandChange
                }
                setMinPrice={
                  setMinPrice
                }
                setMaxPrice={
                  setMaxPrice
                }
                clearFilters={
                  clearFilters
                }
              />

            </Col>

            {/* PRODUCTS */}

            <Col
              xs={12}
              lg={9}
              xl={10}
            >

              <ProductsHeader
                productCount={
                  filteredProducts.length
                }
                sort={sort}
                setSort={setSort}
              />

              {/* ERROR */}

              {error && (
                <Alert variant="danger">
                  Failed to load products: {error}
                </Alert>
              )}

              {/* LOADING */}

              {loading && (
                <div className="text-center py-5">

                  <Spinner
                    animation="border"
                    variant="primary"
                  />

                  <p className="mt-3">
                    Loading products...
                  </p>

                </div>
              )}

              {/* NO PRODUCTS */}

              {!loading &&
                !error &&
                filteredProducts.length === 0 && (

                  <Card className="text-center border-warning">

                    <Card.Body>

                      <Card.Title>
                        No products found
                      </Card.Title>

                      <Card.Text>
                        Try changing your filters or
                        search.
                      </Card.Text>

                      <Button
                        variant="dark"
                        onClick={
                          clearFilters
                        }
                      >
                        Clear Filters
                      </Button>

                    </Card.Body>

                  </Card>

                )}

              {/* PRODUCT GRID */}

              {!loading &&
                !error &&
                filteredProducts.length > 0 && (

                  <ProductGrid
                    products={
                      filteredProducts
                    }
                    viewProduct={
                      viewProduct
                    }
                    addToCart={
                      handleAddToCart
                    }
                  />

                )}

            </Col>

          </Row>

        </Container>

      </main>

    </div>
  );
}

export default Dashboard;