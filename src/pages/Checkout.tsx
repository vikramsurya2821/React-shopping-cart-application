import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import { createOrder } from "../services/orderService";

// =====================================
// ADDRESS TYPE
// =====================================

interface Address {
  id?: string | number;

  userId: string | number;

  fullName: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
}

function Checkout() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { cart, cartCount, totalPrice, clearCart } = useCart();

  // =====================================
  // STEP
  // =====================================

  const [step, setStep] = useState(1);

  // =====================================
  // LOADING
  // =====================================

  const [loading, setLoading] = useState(true);

  // =====================================
  // SAVED ADDRESS
  // =====================================

  const [savedAddress, setSavedAddress] = useState<Address | null>(null);

  // =====================================
  // FORM DATA
  // =====================================

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
  });

  // =====================================
  // LOAD CURRENT USER ADDRESS
  // =====================================

  useEffect(() => {
    const loadCurrentUserAddress = async () => {
      if (!user) {
        navigate("/login");

        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/addresses?userId=${user.id}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load address");
        }

        const data: Address[] = await response.json();

        // Address exists

        if (data.length > 0) {
          setSavedAddress(data[0]);

          setStep(2);
        } else {
          setStep(1);
        }
      } catch (error) {
        console.error("Address loading error:", error);

        setStep(1);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUserAddress();
  }, [user, navigate]);

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // =====================================
  // SAVE ADDRESS
  // =====================================

  const handleSaveAddress = async () => {
    if (!user) {
      navigate("/login");

      return;
    }

    // EMPTY VALIDATION

    if (
      !formData.fullName.trim() ||
      !formData.mobile.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      alert("Please fill all address details");

      return;
    }

    // MOBILE VALIDATION

    if (formData.mobile.length !== 10) {
      alert("Please enter valid 10-digit mobile number");

      return;
    }

    // PINCODE VALIDATION

    if (formData.pincode.length !== 6) {
      alert("Please enter valid 6-digit pincode");

      return;
    }

    try {
      const newAddress: Address = {
        userId: user.id,

        fullName: formData.fullName.trim(),

        mobile: formData.mobile.trim(),

        address: formData.address.trim(),

        city: formData.city.trim(),

        pincode: formData.pincode.trim(),
      };

      const response = await fetch("http://localhost:3000/addresses", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(newAddress),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      const savedData = await response.json();

      setSavedAddress(savedData);

      setStep(2);
    } catch (error) {
      console.error("Save address error:", error);

      alert("Failed to save address");
    }
  };

  // =====================================
  // CONTINUE TO PAYMENT
  // =====================================

  const handleContinueToPayment = () => {
    if (!savedAddress) {
      alert("Please select an address");

      setStep(1);

      return;
    }

    setStep(3);
  };

  // =====================================
  // CONFIRM ORDER
  // =====================================

  const handleConfirmOrder = async () => {
    if (!user) {
      alert("Please login first");

      navigate("/login");

      return;
    }

    if (!savedAddress) {
      alert("Address not found");

      setStep(1);

      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");

      navigate("/cart");

      return;
    }

    try {
      // =============================
      // CREATE ORDER
      // =============================

      await createOrder({
        userId: user.id,

        userName: user.name,

        userEmail: user.email,

        items: cart.map((item) => ({
          productId: item.id,

          name: item.name,

          category: item.category,

          price: item.price,

          brand: item.brand,

          rating: item.rating,

          discount: item.discount,

          description: item.description,

          image: item.image,

          quantity: item.quantity,
        })),

        total: totalPrice,

        date: new Date().toISOString(),

        status: "Placed",
      });

      // =============================
      // CLEAR CART
      // =============================

      await clearCart();

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error("Order error:", error);

      const message = error instanceof Error ? error.message : "Unknown error";

      alert(`Failed to place order: ${message}`);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <Container
        fluid
        className="
          min-vh-100
          d-flex
          flex-column
          justify-content-center
          align-items-center
          bg-light
          gap-3
        "
      >
        <Spinner animation="border" variant="primary" />

        <span className="text-muted">Loading checkout...</span>
      </Container>
    );
  }

  // =====================================
  // EMPTY CART
  // =====================================

  if (cart.length === 0) {
    return (
      <Container
        fluid
        className="
          min-vh-100
          d-flex
          justify-content-center
          align-items-center
          bg-light
          p-3
        "
      >
        <Card
          className="
            shadow-sm
            border-0
            text-center
          "
          style={{
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <Card.Body className="p-5">
            <div className="display-1 mb-3">🛒</div>

            <h2 className="h3 fw-bold">Your cart is empty</h2>

            <p className="text-muted mb-4">
              Add products before proceeding to checkout.
            </p>

            <Button variant="primary" size="lg" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <div
      className="
        min-vh-100
        bg-light
      "
    >
      {/* =============================
          HEADER
      ============================= */}

      <div
        className="
          bg-white
          border-bottom
          py-3
          mb-4
        "
      >
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1
                className="
                  h3
                  fw-bold
                  mb-0
                  cursor-pointer
                "
                style={{
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              >
                🛒 BuyNest
              </h1>
            </Col>

            <Col xs="auto">
              <Button
                variant="outline-primary"
                onClick={() => navigate("/cart")}
              >
                ← Back to Cart
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="pb-5">
        {/* =============================
            TITLE
        ============================= */}

        <div className="text-center mb-4">
          <h2 className="fw-bold">Checkout</h2>

          <p className="text-muted mb-0">
            Complete your order in 3 simple steps
          </p>
        </div>

        {/* =============================
            STEPS
        ============================= */}

        <Card
          className="
            shadow-sm
            border-0
            mb-4
          "
        >
          <Card.Body className="py-3">
            <Row className="text-center">
              {/* STEP 1 */}

              <Col>
                <Badge
                  bg={step >= 1 ? "primary" : "secondary"}
                  pill
                  className="
                    fs-6
                    px-3
                    py-2
                    mb-2
                  "
                >
                  1
                </Badge>

                <div className={step >= 1 ? "fw-bold" : "text-muted"}>
                  Address
                </div>
              </Col>

              {/* STEP 2 */}

              <Col>
                <Badge
                  bg={step >= 2 ? "primary" : "secondary"}
                  pill
                  className="
                    fs-6
                    px-3
                    py-2
                    mb-2
                  "
                >
                  2
                </Badge>

                <div className={step >= 2 ? "fw-bold" : "text-muted"}>
                  Order Summary
                </div>
              </Col>

              {/* STEP 3 */}

              <Col>
                <Badge
                  bg={step >= 3 ? "primary" : "secondary"}
                  pill
                  className="
                    fs-6
                    px-3
                    py-2
                    mb-2
                  "
                >
                  3
                </Badge>

                <div className={step >= 3 ? "fw-bold" : "text-muted"}>
                  Payment
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* =============================
            STEP 1 - ADDRESS
        ============================= */}

        {step === 1 && (
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <Card
                className="
                  shadow-sm
                  border-0
                "
              >
                <Card.Body className="p-4">
                  <Card.Title
                    className="
                      h4
                      fw-bold
                      mb-4
                    "
                  >
                    Delivery Details
                  </Card.Title>

                  {/* NAME */}

                  <Form.Group className="mb-3">
                    <Form.Label>Full Name *</Form.Label>

                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* MOBILE */}

                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number *</Form.Label>

                    <Form.Control
                      type="tel"
                      name="mobile"
                      placeholder="Enter 10-digit mobile number"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* ADDRESS */}

                  <Form.Group className="mb-3">
                    <Form.Label>Delivery Address *</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      placeholder="House No, Street, Area"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* CITY */}

                  <Form.Group className="mb-3">
                    <Form.Label>City *</Form.Label>

                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* PINCODE */}

                  <Form.Group className="mb-4">
                    <Form.Label>Pincode *</Form.Label>

                    <Form.Control
                      type="text"
                      name="pincode"
                      placeholder="Enter 6-digit pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100"
                    onClick={handleSaveAddress}
                  >
                    Save & Continue →
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* =============================
            STEP 2 - ORDER SUMMARY
        ============================= */}

        {step === 2 && (
          <Row className="g-4">
            {/* LEFT */}

            <Col xs={12} lg={8}>
              {/* ADDRESS */}

              <Card
                className="
                  shadow-sm
                  border-0
                  mb-4
                "
              >
                <Card.Body className="p-4">
                  <div
                    className="
                      d-flex
                      justify-content-between
                      align-items-center
                      mb-3
                    "
                  >
                    <Card.Title className="h5 fw-bold mb-0">
                      📍 Deliver To
                    </Card.Title>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setStep(1)}
                    >
                      Change
                    </Button>
                  </div>

                  {savedAddress && (
                    <div className="text-muted">
                      <h3 className="h6 text-dark fw-bold">
                        {savedAddress.fullName}
                      </h3>

                      <p className="mb-1">{savedAddress.address}</p>

                      <p className="mb-1">
                        {savedAddress.city}
                        {" - "}
                        {savedAddress.pincode}
                      </p>

                      <p className="mb-0">📞 {savedAddress.mobile}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* PRODUCTS */}

              <Card
                className="
                  shadow-sm
                  border-0
                "
              >
                <Card.Body className="p-4">
                  <Card.Title className="h5 fw-bold mb-4">
                    Order Items <Badge bg="secondary">{cartCount}</Badge>
                  </Card.Title>

                  {cart.map((item) => (
                    <Row
                      key={item.id}
                      className="
                          align-items-center
                          border-bottom
                          py-3
                          g-3
                        "
                    >
                      {/* IMAGE */}

                      <Col xs={4} sm={3} md={2}>
                        <Image
                          src={item.image || "https://via.placeholder.com/150"}
                          alt={item.name}
                          fluid
                          rounded
                          thumbnail
                        />
                      </Col>

                      {/* INFO */}

                      <Col xs={8} sm={6} md={7}>
                        <h3 className="h6 fw-bold mb-1">{item.name}</h3>

                        <p className="text-muted mb-1">{item.brand}</p>

                        <small className="text-muted">
                          Quantity: <strong>{item.quantity}</strong>
                        </small>
                      </Col>

                      {/* PRICE */}

                      <Col
                        xs={12}
                        sm={3}
                        md={3}
                        className="
                            text-sm-end
                          "
                      >
                        <strong className="fs-6">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </strong>
                      </Col>
                    </Row>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* RIGHT - PRICE */}

            <Col xs={12} lg={4}>
              <Card
                className="
                  shadow-sm
                  border-0
                "
              >
                <Card.Body className="p-4">
                  <Card.Title className="h5 fw-bold mb-4">
                    Price Details
                  </Card.Title>

                  <div
                    className="
                      d-flex
                      justify-content-between
                      mb-3
                    "
                  >
                    <span className="text-muted">Items</span>

                    <strong>{cartCount}</strong>
                  </div>

                  <div
                    className="
                      d-flex
                      justify-content-between
                      mb-3
                    "
                  >
                    <span className="text-muted">Delivery</span>

                    <strong className="text-success">FREE</strong>
                  </div>

                  <hr />

                  <div
                    className="
                      d-flex
                      justify-content-between
                      align-items-center
                      mb-4
                    "
                  >
                    <h5 className="fw-bold mb-0">Total Amount</h5>

                    <h4 className="fw-bold mb-0">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </h4>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100"
                    onClick={handleContinueToPayment}
                  >
                    Continue to Payment →
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* =============================
            STEP 3 - PAYMENT
        ============================= */}

        {step === 3 && (
          <Row className="justify-content-center">
            <Col xs={12} md={9} lg={7} xl={6}>
              <Card
                className="
                  shadow-sm
                  border-0
                "
              >
                <Card.Body className="p-4 p-md-5">
                  <Card.Title className="h3 fw-bold mb-2">
                    Payment Method
                  </Card.Title>

                  <Card.Text className="text-muted mb-4">
                    Choose your preferred payment method
                  </Card.Text>

                  {/* COD */}

                  <Card className="mb-3">
                    <Card.Body>
                      <Form.Check
                        type="radio"
                        id="cod"
                        name="payment"
                        defaultChecked
                        label={
                          <div className="ms-2">
                            <strong>💵 Cash on Delivery</strong>

                            <br />

                            <small className="text-muted">
                              Pay when your order arrives
                            </small>
                          </div>
                        }
                      />
                    </Card.Body>
                  </Card>

                  {/* UPI */}

                  <Card className="mb-3">
                    <Card.Body>
                      <Form.Check
                        type="radio"
                        id="upi"
                        name="payment"
                        label={
                          <div className="ms-2">
                            <strong>📱 UPI Payment</strong>

                            <br />

                            <small className="text-muted">
                              Google Pay, PhonePe, Paytm and more
                            </small>
                          </div>
                        }
                      />
                    </Card.Body>
                  </Card>

                  {/* CARD */}

                  <Card className="mb-4">
                    <Card.Body>
                      <Form.Check
                        type="radio"
                        id="card"
                        name="payment"
                        label={
                          <div className="ms-2">
                            <strong>💳 Credit / Debit Card</strong>

                            <br />

                            <small className="text-muted">
                              Secure card payment
                            </small>
                          </div>
                        }
                      />
                    </Card.Body>
                  </Card>

                  {/* TOTAL */}

                  <Alert
                    variant="light"
                    className="
                      border
                      mb-4
                    "
                  >
                    <Row className="align-items-center">
                      <Col>
                        <strong>Total Payable</strong>

                        <br />

                        <small className="text-muted">
                          Including all taxes
                        </small>
                      </Col>

                      <Col xs="auto" className="text-end">
                        <h3 className="fw-bold mb-0">
                          ₹{totalPrice.toLocaleString("en-IN")}
                        </h3>
                      </Col>
                    </Row>
                  </Alert>

                  {/* CONFIRM */}

                  <Button
                    variant="success"
                    size="lg"
                    className="w-100"
                    onClick={handleConfirmOrder}
                  >
                    Confirm Order →
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Checkout;
