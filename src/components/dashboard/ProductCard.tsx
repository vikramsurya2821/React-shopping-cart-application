import {
  Badge,
  Button,
  Card,
} from "react-bootstrap";

import type {
  Product,
  ProductVariant,
} from "../../types/Product";

import {
  useWishlist,
} from "../../context/WishlistContext";


interface ProductCardProps {
  product: Product;

  viewProduct: (id: number) => void;

  addToCart: (product: Product) => void;
}


function ProductCard({
  product,
  viewProduct,
  addToCart,
}: ProductCardProps) {


  // =====================================
  // WISHLIST
  // =====================================

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();


  // =====================================
  // FIND LOWEST PRICE VARIANT
  // =====================================

  const defaultVariant: ProductVariant | null =
    product.variants &&
    product.variants.length > 0
      ? product.variants.reduce(
          (lowest, current) =>
            current.price < lowest.price
              ? current
              : lowest
        )
      : null;


  // =====================================
  // DISPLAY PRICE
  // =====================================

  const displayPrice =
    defaultVariant?.price ??
    product.price;


  // =====================================
  // DISPLAY STOCK
  // =====================================

  const displayStock =
    defaultVariant?.stock ??
    product.stock;


  // =====================================
  // VARIANT NAME
  // =====================================

  const variantName =
    defaultVariant
      ? [
          defaultVariant.ram &&
            `${defaultVariant.ram} RAM`,

          defaultVariant.storage,

          defaultVariant.color,

          defaultVariant.size,
        ]
          .filter(Boolean)
          .join(" / ")
      : "";


  // =====================================
  // DISCOUNTED PRICE
  // =====================================

  const discountedPrice =
    displayPrice -
    (displayPrice * product.discount) / 100;


  // =====================================
  // WISHLIST HANDLER
  // =====================================

  const handleWishlist = () => {

    if (
      isInWishlist(product.id)
    ) {

      removeFromWishlist(
        product.id
      );

    } else {

      addToWishlist(
        product
      );

    }

  };


  // =====================================
  // ADD TO CART
  // =====================================

  const handleAddToCart = () => {

    const productWithVariant: Product = {

      ...product,

      // LOWEST / DEFAULT VARIANT PRICE
      price: displayPrice,

      // LOWEST / DEFAULT VARIANT STOCK
      stock: displayStock,

      // SAVE SELECTED VARIANT
      selectedVariant:
        defaultVariant,

    };

    addToCart(
      productWithVariant
    );

  };


  return (

    <Card
      className="
        h-100
        shadow-sm
        position-relative
      "
    >


      {/* =====================
          WISHLIST BUTTON
      ===================== */}

      <Button
        variant={
          isInWishlist(product.id)
            ? "danger"
            : "light"
        }
        className="
          position-absolute
          top-0
          start-0
          m-2
          rounded-circle
        "
        style={{
          width: "42px",
          height: "42px",
          zIndex: 2,
        }}
        onClick={handleWishlist}
        title={
          isInWishlist(product.id)
            ? "Remove from Wishlist"
            : "Add to Wishlist"
        }
      >

        {isInWishlist(product.id)
          ? "♥"
          : "♡"}

      </Button>


      {/* =====================
          DISCOUNT BADGE
      ===================== */}

      {product.discount > 0 && (

        <Badge
          bg="danger"
          className="
            position-absolute
            top-0
            end-0
            m-2
          "
          style={{
            zIndex: 2,
          }}
        >

          {product.discount}% OFF

        </Badge>

      )}


      {/* =====================
          PRODUCT IMAGE
      ===================== */}

      <Card.Img
        variant="top"
        src={product.image}
        alt={product.name}
        onClick={() =>
          viewProduct(product.id)
        }
        style={{
          height: "220px",
          objectFit: "contain",
          padding: "1rem",
          cursor: "pointer",
        }}
      />


      {/* =====================
          PRODUCT BODY
      ===================== */}

      <Card.Body
        className="
          d-flex
          flex-column
        "
      >


        {/* BRAND */}

        <Card.Text
          className="
            text-muted
            small
            mb-1
          "
        >

          {product.brand}

        </Card.Text>


        {/* =====================
            MODEL NAME
        ===================== */}

        <Card.Title
          className="mb-1"
          style={{
            cursor: "pointer",
          }}
          onClick={() =>
            viewProduct(product.id)
          }
        >

          {product.name}

        </Card.Title>


        {/* =====================
            VARIANT NAME
        ===================== */}

        {variantName && (

          <Card.Text
            className="
              text-primary
              small
              fw-semibold
              mb-2
            "
          >

            {variantName}

          </Card.Text>

        )}


        {/* =====================
            RATING
        ===================== */}

        <Card.Text className="mb-2">

          ⭐ {product.rating}

        </Card.Text>


        {/* =====================
            PRICE
        ===================== */}

        <div className="mb-2">


          {/* DISCOUNTED PRICE */}

          <span className="fw-bold fs-5">

            ₹
            {discountedPrice.toLocaleString(
              "en-IN"
            )}

          </span>


          {/* ORIGINAL PRICE */}

          {product.discount > 0 && (

            <span
              className="
                text-muted
                text-decoration-line-through
                ms-2
              "
            >

              ₹
              {displayPrice.toLocaleString(
                "en-IN"
              )}

            </span>

          )}

        </div>


        {/* =====================
            STOCK
        ===================== */}

        <Card.Text
          className="
            text-muted
            small
            mb-3
          "
        >

          {displayStock > 0
            ? `${displayStock} available`
            : "Out of stock"}

        </Card.Text>


        {/* Push buttons to bottom */}

        <div className="mt-auto">


          {/* =====================
              DETAILS
          ===================== */}

          <Button
            variant="outline-primary"
            className="w-100 mb-2"
            onClick={() =>
              viewProduct(product.id)
            }
          >

            Details

          </Button>


          {/* =====================
              ADD TO CART
          ===================== */}

          <Button
            variant="primary"
            className="w-100"
            disabled={
              displayStock === 0
            }
            onClick={
              handleAddToCart
            }
          >

            {displayStock === 0
              ? "Out of Stock"
              : "Add to Cart"}

          </Button>

        </div>

      </Card.Body>

    </Card>

  );
}


export default ProductCard;