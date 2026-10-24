import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Stack,
} from "react-bootstrap";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";


function Cart() {

  const navigate = useNavigate();


  const {
    cart,
    cartCount,
    totalPrice,
    removeFromCart,
    increase,
    decrease,
  } = useCart();


  const { user } = useAuth();


  // =====================================
  // PLACE ORDER
  // =====================================

  const handlePlaceOrder = () => {

    // LOGIN CHECK

    if (!user) {

      alert("Please login first");

      navigate("/login");

      return;
    }


    // EMPTY CART CHECK

    if (cart.length === 0) {

      alert("Your cart is empty");

      return;
    }


    // GO TO CHECKOUT

    navigate("/checkout");

  };


  // =====================================
  // EMPTY CART
  // =====================================

  if (cart.length === 0) {

    return (

      <Container className="py-5 text-center">

        <Card className="empty-cart p-5 shadow-sm">

          <Card.Body>

            <h1>
              Your Cart is Empty 🛒
            </h1>

            <p className="text-muted">
              Add some products to your cart
            </p>

            <Button
              variant="primary"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>

          </Card.Body>

        </Card>

      </Container>

    );

  }


  // =====================================
  // CART PAGE
  // =====================================

  return (

    <div className="cart-page py-4">

      <Container>


        {/* =========================
            HEADER
        ========================= */}

        <div className="cart-header text-center mb-4">

          <Button
            variant="outline-primary"
            className="mb-3"
            onClick={() => navigate("/")}
          >
            🛒 Continue Shopping
          </Button>


          <h1>
            My Cart
          </h1>


          <p className="text-muted">

            {cartCount}{" "}

            {cartCount === 1
              ? "item"
              : "items"
            }{" "}

            in your Cart

          </p>

        </div>


        {/* =========================
            MAIN CONTENT
        ========================= */}

        <Row className="g-4">


          {/* =========================
              CART ITEMS
          ========================= */}

          <Col lg={8}>

            <Stack gap={3}>


              {cart.map((item) => {


                // =====================================
                // ITEM TOTAL
                // =====================================

                const itemTotal =
                  item.price *
                  item.quantity;


                return (

                  <Card
                    className="cart-item shadow-sm"

                    // IMPORTANT:
                    // PRODUCT ID மட்டும் பயன்படுத்தக்கூடாது.
                    // PRODUCT + VARIANT UNIQUE ID பயன்படுத்த வேண்டும்.

                    key={item.cartItemId}
                  >

                    <Card.Body>

                      <Row className="align-items-center g-3">


                        {/* =========================
                            PRODUCT IMAGE
                        ========================= */}

                        <Col
                          xs={12}
                          md={3}
                          className="text-center"
                        >

                          <Image
                            src={
                              item.image ||
                              "https://via.placeholder.com/150"
                            }

                            alt={item.name}

                            fluid

                            rounded

                            className="cart-product-image"
                          />

                        </Col>


                        {/* =========================
                            PRODUCT DETAILS
                        ========================= */}

                        <Col
                          xs={12}
                          md={4}
                        >

                          {/* PRODUCT NAME */}
                          <h4>
                            {item.name}
                          </h4>

                          {item.selectedVariant && (
                            <p className="mb-2">
                              <strong>Variant:</strong>{" "}

                              <span className="text-primary">
                                {[
                                  item.selectedVariant.ram &&
                                  `${item.selectedVariant.ram} RAM`,
                                  item.selectedVariant.storage,
                                  item.selectedVariant.color,
                                  item.selectedVariant.size,
                                ]
                                  .filter(Boolean)
                                  .join(" / ")}
                              </span>
                            </p>
                          )}


                          {/* BRAND */}

                          <p className="mb-1">

                            <strong>
                              Brand:
                            </strong>{" "}

                            {item.brand}

                          </p>


                          {/* CATEGORY */}

                          <p className="mb-1">

                            <strong>
                              Category:
                            </strong>{" "}

                            {item.category}

                          </p>


                          {/* RATING */}

                          <div className="mb-2">

                            ⭐ {item.rating}

                          </div>


                          {/* PRICE */}

                          <h5 className="product-price">

                            ₹
                            {item.price.toLocaleString(
                              "en-IN"
                            )}

                          </h5>


                          {/* DISCOUNT */}

                          {item.discount > 0 && (

                            <span className="discount">

                              {item.discount}% off

                            </span>

                          )}

                        </Col>


                        {/* =========================
                            QUANTITY
                        ========================= */}

                        <Col
                          xs={6}
                          md={2}
                          className="text-center"
                        >

                          <h6>
                            Quantity
                          </h6>


                          <div className="
                            d-flex
                            justify-content-center
                            align-items-center
                            gap-2
                          ">


                            {/* MINUS */}

                            <Button
                              variant="outline-secondary"
                              size="sm"

                              onClick={() =>
                                decrease(
                                  item.cartItemId
                                )
                              }
                            >
                              −
                            </Button>


                            {/* QUANTITY */}

                            <strong>

                              {item.quantity}

                            </strong>


                            {/* PLUS */}

                            <Button
                              variant="outline-secondary"
                              size="sm"

                              onClick={() =>
                                increase(
                                  item.cartItemId
                                )
                              }
                            >
                              +
                            </Button>

                          </div>

                        </Col>


                        {/* =========================
                            TOTAL
                        ========================= */}

                        <Col
                          xs={6}
                          md={2}
                          className="text-center"
                        >

                          <h6>
                            Total
                          </h6>


                          <h5>

                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}

                          </h5>

                        </Col>


                        {/* =========================
                            REMOVE
                        ========================= */}

                        <Col
                          xs={12}
                          md={1}
                          className="text-center"
                        >

                          <Button
                            variant="outline-danger"
                            size="sm"

                            onClick={() =>
                              removeFromCart(
                                item.cartItemId
                              )
                            }
                          >
                            Remove
                          </Button>

                        </Col>

                      </Row>

                    </Card.Body>

                  </Card>

                );

              })}

            </Stack>

          </Col>


          {/* =========================
              PRICE DETAILS
          ========================= */}

          <Col lg={4}>

            <Card className="price-details shadow-sm">

              <Card.Body>


                <h3 className="mb-4">

                  Price Details

                </h3>


                {/* PRICE */}

                <div className="
                  d-flex
                  justify-content-between
                  mb-3
                ">

                  <span>

                    Price (
                    {cartCount}{" "}

                    {cartCount === 1
                      ? "item"
                      : "items"
                    }
                    )

                  </span>


                  <strong>

                    ₹
                    {totalPrice.toLocaleString(
                      "en-IN"
                    )}

                  </strong>

                </div>


                {/* DELIVERY */}

                <div className="
                  d-flex
                  justify-content-between
                  mb-3
                ">

                  <span>
                    Delivery
                  </span>


                  <strong className="text-success">

                    FREE

                  </strong>

                </div>


                <hr />


                {/* TOTAL */}

                <div className="
                  d-flex
                  justify-content-between
                  mb-4
                ">

                  <h4>
                    Total Amount
                  </h4>


                  <h4>

                    ₹
                    {totalPrice.toLocaleString(
                      "en-IN"
                    )}

                  </h4>

                </div>


                {/* PLACE ORDER */}

                <Button
                  variant="success"
                  size="lg"
                  className="w-100"

                  onClick={
                    handlePlaceOrder
                  }
                >

                  Place Order

                </Button>

              </Card.Body>

            </Card>

          </Col>

        </Row>

      </Container>

    </div>

  );

}


export default Cart;