import type { Product } from "../types/Product";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
  viewDetails: (id: number) => void;
}

function ProductCard({
  product,
  addToCart,
  viewDetails,
}: ProductCardProps) {
  const navigate = useNavigate();
const { user } = useAuth();
  return (
    <div className="buy-product-card">

      {/* Product Image */}
      <div className="buy-product-card-image">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
          />
        ) : (
          <span>🛍️</span>
        )}
      </div>

      {/* Product Name */}
      <h3 className="buy-product-card-name">
        {product.name}
      </h3>

      {/* Brand */}
      <p className="buy-product-card-brand">
        {product.brand}
      </p>

      {/* Rating */}
      <div className="buy-product-card-rating">
        ⭐ {product.rating}
      </div>

      {/* Price */}
      <div className="buy-product-card-price">
        <strong>
          ₹{Number(product.price).toLocaleString("en-IN")}
        </strong>

        <span>
          {product.discount}% off
        </span>
      </div>

      {/* Stock */}
      <p
        className={
          product.stock > 0
            ? "buy-product-card-stock available"
            : "buy-product-card-stock out"
        }
      >
        {product.stock > 0
          ? `${product.stock} available`
          : "Out of Stock"}
      </p>

      {/* Buttons */}
      <div className="buy-product-card-buttons">

        <button
          type="button"
          className="buy-product-card-details"
          onClick={() => viewDetails(product.id)}
        >
          Details
        </button>

        <button
  type="button"
  className="buy-product-card-cart"
  disabled={product.stock === 0}
  onClick={() => {
    if (!user) {
      navigate("/login");
      return;
    }

    addToCart(product);
  }}
>
  🛒 Add
</button>

      </div>

    </div>
  );
}

export default ProductCard;