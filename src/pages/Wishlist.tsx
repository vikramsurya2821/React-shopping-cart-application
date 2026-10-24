import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {

  const navigate = useNavigate();

  const {
    wishlist,
    loading,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();


  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <Container className="text-center mt-5">

        <Spinner animation="border" />

        <p className="mt-3">
          Loading wishlist...
        </p>

      </Container>
    );
  }


  // ================================
  // EMPTY WISHLIST
  // ================================

  if (wishlist.length === 0) {
    return (
      <Container className="text-center mt-5">

        <div className="d-flex align-items-center gap-3 mb-4">

          <Button
            variant="outline-secondary"
            onClick={() => navigate("/")}
          >
            ← Back
          </Button>

          <h2 className="mb-0">
            My Wishlist
          </h2>

        </div>

        <p className="text-muted mt-3">
          Your wishlist is empty ❤️
        </p>

      </Container>
    );
  }


  return (
    <Container className="mt-4">

      {/* HEADER */}

      <div className="d-flex align-items-center gap-3 mb-4">

        <Button
          variant="outline-secondary"
          onClick={() => navigate("/")}
        >
          ← Back
        </Button>

        <h2 className="mb-0">
          My Wishlist ({wishlist.length})
        </h2>

      </div>


      <Row>

        {wishlist.map((item) => {

          const product = item.product;

          return (
            <Col
              key={item.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="mb-4"
            >

              <Card className="h-100 shadow-sm">

                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  style={{
                    height: "220px",
                    objectFit: "contain",
                    padding: "1rem",
                  }}
                />

                <Card.Body className="d-flex flex-column">

                  <Card.Text className="text-muted small mb-1">
                    {product.brand}
                  </Card.Text>

                  <Card.Title>
                    {product.name}
                  </Card.Title>

                  <Card.Text>
                    ⭐ {product.rating}
                  </Card.Text>

                  <div className="mb-3">
                    <span className="fw-bold fs-5">
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>


                  {/* ADD TO CART */}

                  <Button
                    variant="primary"
                    className="w-100 mb-2"
                    disabled={product.stock === 0}
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </Button>


                  {/* REMOVE */}

                  <Button
                    variant="outline-danger"
                    className="w-100"
                    onClick={() =>
                      removeFromWishlist(
                        item.productId
                      )
                    }
                  >
                    Remove ❤️
                  </Button>

                </Card.Body>

              </Card>

            </Col>
          );
        })}

      </Row>

    </Container>
  );
}

export default Wishlist;