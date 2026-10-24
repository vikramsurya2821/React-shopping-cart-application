import {
  useEffect,
  useState,
} from "react";

import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import type {
  Product,
  ProductVariant,
} from "../types/Product";

import { useCart } from "../context/CartContext";


function ProductDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();


  // =====================================
  // STATE
  // =====================================

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant | null>(null);


  // =====================================
  // FETCH PRODUCT
  // =====================================

  useEffect(() => {

    fetch(
      `http://localhost:3000/products/${id}`
    )
      .then((res) => {

        if (!res.ok) {
          throw new Error(
            "Product not found"
          );
        }

        return res.json();

      })
      .then((data: Product) => {

        setProduct(data);

        // Automatically select first variant
        if (
          data.variants &&
          data.variants.length > 0
        ) {

          setSelectedVariant(
            data.variants[0]
          );

        } else {

          setSelectedVariant(null);

        }

        setLoading(false);

      })
      .catch(() => {

        setProduct(null);

        setLoading(false);

      });

  }, [id]);


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <Container className="py-5 text-center">

        <Spinner
          animation="border"
          variant="primary"
          className="mb-3"
        />

        <h2 className="h5">
          Loading...
        </h2>

      </Container>
    );
  }


  // =====================================
  // PRODUCT NOT FOUND
  // =====================================

  if (!product) {

    return (
      <Container className="py-5">

        <Card
          className="
            text-center
            shadow-sm
            border-0
            mx-auto
          "
          style={{
            maxWidth: "500px",
          }}
        >

          <Card.Body className="p-5">

            <h2 className="h4">
              Product not found
            </h2>

            <Button
              variant="primary"
              onClick={() => navigate("/")}
            >
              Go Home
            </Button>

          </Card.Body>

        </Card>

      </Container>
    );
  }


  // =====================================
  // CURRENT VARIANT PRICE
  // =====================================

  const currentPrice =
    selectedVariant?.price ??
    product.price;


  // =====================================
  // CURRENT VARIANT STOCK
  // =====================================

  const currentStock =
    selectedVariant?.stock ??
    product.stock;


  // =====================================
  // ADD TO CART
  // =====================================

  const handleAddToCart = () => {

    const productWithVariant = {
      ...product,

      // Selected variant price
      price: currentPrice,

      // Selected variant stock
      stock: currentStock,

      // Save selected variant information
      selectedVariant:
        selectedVariant,
    };

    addToCart(productWithVariant);
  };


  // =====================================
  // BUY NOW
  // =====================================

  const handleBuyNow = () => {

    const productWithVariant = {
      ...product,

      price: currentPrice,

      stock: currentStock,

      selectedVariant:
        selectedVariant,
    };

    addToCart(productWithVariant);

    navigate("/checkout");
  };


  // =====================================
  // PRODUCT DETAILS
  // =====================================

  return (

    <Container className="py-4 py-md-5">

      {/* BACK BUTTON */}

      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>


      <Card className="shadow-sm border-0">

        <Card.Body className="p-4 p-md-5">

          <Row className="align-items-center g-5">


            {/* =========================
                PRODUCT IMAGE
            ========================= */}

            <Col
              xs={12}
              md={6}
              className="text-center"
            >

              {product.image ? (

                <Image
                  src={product.image}
                  alt={product.name}
                  fluid
                  rounded
                  style={{
                    maxHeight: "450px",
                    objectFit: "contain",
                  }}
                />

              ) : (

                <div className="display-1">
                  🛍️
                </div>

              )}

            </Col>


            {/* =========================
                PRODUCT INFORMATION
            ========================= */}

            <Col
              xs={12}
              md={6}
            >

              {/* BRAND */}

              <p className="text-muted mb-2">

                {product.brand}

              </p>


              {/* PRODUCT NAME */}

              <h1 className="fw-bold mb-3">

                {product.name}

              </h1>


              {/* RATING */}

              <div className="mb-3">

                <Badge
                  bg="warning"
                  text="dark"
                  className="px-3 py-2"
                >
                  ⭐ {product.rating}
                </Badge>

              </div>


              {/* =========================
                  SELECT VARIANT
              ========================= */}

              {product.variants &&
                product.variants.length > 0 && (

                <Card
                  className="
                    bg-light
                    border-0
                    mb-4
                  "
                >

                  <Card.Body>

                    <h5 className="mb-3">

                      Select Variant

                    </h5>


                    {product.variants.map(
                      (variant) => (

                        <Button
                          key={variant.id}
                          variant={
                            selectedVariant?.id ===
                            variant.id
                              ? "primary"
                              : "outline-primary"
                          }
                          className="me-2 mb-2"
                          onClick={() =>
                            setSelectedVariant(
                              variant
                            )
                          }
                        >

                          {/* RAM */}

                          {variant.ram && (
                            <>
                              {variant.ram} RAM{" "}
                            </>
                          )}


                          {/* STORAGE */}

                          {variant.storage && (
                            <>
                              {variant.storage}{" "}
                            </>
                          )}


                          {/* COLOR */}

                          {variant.color && (
                            <>
                              {variant.color}{" "}
                            </>
                          )}


                          {/* SIZE */}

                          {variant.size && (
                            <>
                              {variant.size}
                            </>
                          )}

                        </Button>

                      )
                    )}

                  </Card.Body>

                </Card>

              )}


              {/* =========================
                  SELECTED VARIANT DETAILS
              ========================= */}

              {selectedVariant && (

                <div className="mb-3">

                  <p className="mb-1 fw-semibold">

                    Selected:

                  </p>

                  <span className="text-muted">

                    {selectedVariant.ram &&
                      `${selectedVariant.ram} RAM `}

                    {selectedVariant.storage &&
                      `${selectedVariant.storage} `}

                    {selectedVariant.color &&
                      `${selectedVariant.color} `}

                    {selectedVariant.size &&
                      `${selectedVariant.size}`}

                  </span>

                </div>

              )}


              {/* =========================
                  PRICE
              ========================= */}

              <h2 className="fw-bold mb-2">

                ₹
                {currentPrice.toLocaleString(
                  "en-IN"
                )}

              </h2>


              {/* STOCK */}

              <p
                className={
                  currentStock > 0
                    ? "text-success"
                    : "text-danger"
                }
              >

                {currentStock > 0
                  ? `${currentStock} in stock`
                  : "Out of Stock"}

              </p>


              {/* DISCOUNT */}

              {product.discount > 0 && (

                <Badge
                  bg="success"
                  className="mb-3"
                >

                  {product.discount}% OFF

                </Badge>

              )}


              {/* =========================
                  DESCRIPTION
              ========================= */}

              <Card
                className="
                  bg-light
                  border-0
                  mb-4
                "
              >

                <Card.Body>

                  <h5>

                    Product Description

                  </h5>

                  <p className="text-muted mb-0">

                    {product.description}

                  </p>

                </Card.Body>

              </Card>


              {/* =========================
                  ACTION BUTTONS
              ========================= */}

              <Row className="g-3">


                {/* ADD TO CART */}

                <Col
                  xs={12}
                  sm={6}
                >

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100"
                    disabled={
                      currentStock === 0
                    }
                    onClick={() => {

                      handleAddToCart();

                      navigate("/cart");

                    }}
                  >

                    🛒 Add to Cart

                  </Button>

                </Col>


                {/* BUY NOW */}

                <Col
                  xs={12}
                  sm={6}
                >

                  <Button
                    variant="success"
                    size="lg"
                    className="w-100"
                    disabled={
                      currentStock === 0
                    }
                    onClick={() => {

                      handleBuyNow();

                    }}
                  >

                    Buy Now

                  </Button>

                </Col>

              </Row>

            </Col>

          </Row>

        </Card.Body>

      </Card>

    </Container>

  );
}

export default ProductDetails;