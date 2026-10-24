import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";

import { useAuth } from "../context/AuthContext";

import useApi from "../hooks/useApi";

import {
  getUserOrders,
} from "../services/orderService";

function Orders() {

  const { user } = useAuth();

  const navigate = useNavigate();

  const {
    data: orders,
    loading,
    error,
    callAPI: fetchOrders,
  } = useApi(getUserOrders);

  // ================================
  // FETCH CURRENT USER ORDERS
  // ================================

  useEffect(() => {

    if (!user) {
      return;
    }

    fetchOrders(user.id).catch(
      (error) => {
        console.error(
          "Failed to fetch orders:",
          error
        );
      }
    );

  }, [user, fetchOrders]);

  // ================================
  // NOT LOGGED IN
  // ================================

  if (!user) {

    return (
      <Container className="py-5">

        <Card
          className="
            mx-auto
            border-0
            shadow-sm
            text-center
          "
          style={{
            maxWidth: "500px",
          }}
        >

          <Card.Body className="p-5">

            <h1 className="h3 fw-bold mb-3">
              My Orders
            </h1>

            <p className="text-muted mb-4">
              Please login to view your orders.
            </p>

            <Button
              variant="primary"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </Button>

          </Card.Body>

        </Card>

      </Container>
    );
  }

  // ================================
  // LOADING
  // ================================

  if (loading) {

    return (
      <Container className="py-5 text-center">

        <Spinner
          animation="border"
          variant="primary"
          className="mb-3"
        />

        <p className="text-muted">
          Loading your orders...
        </p>

      </Container>
    );
  }

  // ================================
  // ERROR
  // ================================

  if (error) {

    return (
      <Container className="py-5">

        <h1 className="h2 fw-bold mb-4">
          My Orders
        </h1>

        <Alert variant="danger">
          Failed to load orders: {error}
        </Alert>

      </Container>
    );
  }

  // ================================
  // SORT LATEST FIRST
  // ================================

  const sortedOrders =
    [...(orders ?? [])].sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  return (

    <Container className="py-4 py-md-5">

      {/* HEADER */}

      <Row
        className="
          align-items-center
          mb-4
        "
      >

        <Col>

          <h1 className="fw-bold mb-1">
            My Orders
          </h1>

          <p className="text-muted mb-0">
            Welcome back, {user.name}
          </p>

        </Col>

        <Col xs="auto">

          <Button
            variant="outline-primary"
            onClick={() =>
              navigate("/")
            }
          >
            ← Continue Shopping
          </Button>

        </Col>

      </Row>

      {/* NO ORDERS */}

      {sortedOrders.length === 0 ? (

        <Card
          className="
            border-0
            shadow-sm
            text-center
          "
        >

          <Card.Body className="py-5">

            <h2 className="h4 fw-bold">
              No Orders Yet
            </h2>

            <p className="text-muted mb-4">
              You haven't placed any orders yet.
            </p>

            <Button
              variant="primary"
              onClick={() =>
                navigate("/")
              }
            >
              Start Shopping
            </Button>

          </Card.Body>

        </Card>

      ) : (

        sortedOrders.map((order) => (

          <Card
            key={order.id}
            className="border mb-4"
          >

            {/* ORDER HEADER */}

            <Card.Body className="pb-3">

              <Row className="align-items-center">

                <Col>

                  <h3 className="h5 fw-bold mb-1">
                    Order #{order.id}
                  </h3>

                  <small className="text-muted">

                    Ordered on{" "}

                    {new Date(
                      order.date
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </small>

                </Col>

                <Col xs="auto">

                  <Badge
                    bg="success"
                    pill
                    className="px-3 py-2"
                  >
                    ● {order.status}
                  </Badge>

                </Col>

              </Row>

            </Card.Body>

            <hr className="m-0" />

            {/* PRODUCTS */}

            <Card.Body className="py-3">

              {order.items.map(
                (item, index) => (

                  <Row
                    key={
                      item.productId ??
                      index
                    }
                    className="
                      align-items-center
                      py-3
                    "
                  >

                    {/* IMAGE */}

                    <Col
                      xs={4}
                      sm={3}
                      md={2}
                    >

                      {item.image ? (

                        <Image
                          src={item.image}
                          alt={item.name}
                          fluid
                          rounded
                          thumbnail
                        />

                      ) : (

                        <div className="text-muted">
                          No Image
                        </div>

                      )}

                    </Col>

                    {/* PRODUCT INFO */}

                    <Col
                      xs={8}
                      sm={6}
                      md={7}
                    >

                      <h3 className="h6 fw-bold mb-1">
                        {item.name}
                      </h3>

                      <p className="text-muted small mb-1">
                        {item.category}
                      </p>

                      <p className="small mb-1">
                        Brand: {item.brand}
                      </p>

                      <p className="small mb-0">
                        Quantity: {item.quantity}
                      </p>

                    </Col>

                    {/* PRICE */}

                    <Col
                      xs={12}
                      sm={3}
                      md={3}
                      className="
                        text-sm-end
                        mt-3
                        mt-sm-0
                      "
                    >

                      <span className="fw-bold fs-6">

                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </span>

                    </Col>

                  </Row>

                )
              )}

            </Card.Body>

            <hr className="m-0" />

            {/* ORDER FOOTER */}

            <Card.Body>

              <Row className="align-items-center">

                {/* CUSTOMER */}

                <Col
                  xs={12}
                  md={6}
                  className="mb-3 mb-md-0"
                >

                  <small className="text-muted d-block mb-1">
                    CUSTOMER
                  </small>

                  <strong>
                    {order.userName}
                  </strong>

                  <small className="text-muted d-block">
                    {order.userEmail}
                  </small>

                </Col>

                {/* TOTAL */}

                <Col
                  xs={12}
                  md={6}
                  className="text-md-end"
                >

                  <small className="text-muted d-block mb-1">
                    ORDER TOTAL
                  </small>

                  <h2 className="h4 fw-bold mb-0">

                    ₹
                    {order.total.toLocaleString(
                      "en-IN"
                    )}

                  </h2>

                </Col>

              </Row>

            </Card.Body>

          </Card>

        ))

      )}

    </Container>
  );
}

export default Orders;