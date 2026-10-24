import { useNavigate } from "react-router-dom";

import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";

import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  // =====================================
  // NOT LOGGED IN
  // =====================================

  if (!user) {
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
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <Card.Body className="p-5">

            <div className="display-1 mb-3">
              🔒
            </div>

            <Card.Title
              as="h1"
              className="h3 fw-bold mb-3"
            >
              Please Login
            </Card.Title>

            <Card.Text className="text-muted mb-4">
              Login to view your profile and manage
              your orders.
            </Card.Text>

            <Button
              variant="primary"
              size="lg"
              className="w-100"
              onClick={() =>
                navigate("/login")
              }
            >
              Go to Login
            </Button>

          </Card.Body>
        </Card>
      </Container>
    );
  }

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  // =====================================
  // PROFILE
  // =====================================

  return (
    <Container
      fluid
      className="
        min-vh-100
        bg-light
        py-4
        py-md-5
      "
    >
      <Row className="justify-content-center">

        <Col
          xs={12}
          sm={10}
          md={8}
          lg={6}
          xl={5}
        >

          <Card
            className="
              shadow-sm
              border-0
              overflow-hidden
            "
          >

            {/* =========================
                PROFILE HEADER
            ========================= */}

            <Card.Body
              className="
                text-center
                p-4
                p-md-5
                border-bottom
              "
            >

              <div className="display-1 mb-3">
                👤
              </div>

              <h1 className="h2 fw-bold mb-2">
                My Profile
              </h1>

              <p className="text-muted mb-3">
                Manage your account information
              </p>

              <Badge
                bg="success"
                pill
                className="px-3 py-2"
              >
                Active Account
              </Badge>

            </Card.Body>

            {/* =========================
                PROFILE INFORMATION
            ========================= */}

            <Card.Body
              className="
                p-4
                p-md-5
              "
            >

              <h2 className="h5 fw-bold mb-4">
                Account Information
              </h2>

              {/* NAME */}

              <div className="border rounded p-3 mb-3">

                <Row className="align-items-center">

                  <Col xs={4}>

                    <small className="text-muted">
                      NAME
                    </small>

                  </Col>

                  <Col
                    xs={8}
                    className="text-end"
                  >

                    <strong>
                      {user.name}
                    </strong>

                  </Col>

                </Row>

              </div>

              {/* EMAIL */}

              <div className="border rounded p-3 mb-3">

                <Row className="align-items-center">

                  <Col xs={4}>

                    <small className="text-muted">
                      EMAIL
                    </small>

                  </Col>

                  <Col
                    xs={8}
                    className="text-end"
                  >

                    <strong
                      className="
                        text-break
                      "
                    >
                      {user.email}
                    </strong>

                  </Col>

                </Row>

              </div>

              {/* USER ID */}

              <div className="border rounded p-3 mb-4">

                <Row className="align-items-center">

                  <Col xs={4}>

                    <small className="text-muted">
                      USER ID
                    </small>

                  </Col>

                  <Col
                    xs={8}
                    className="text-end"
                  >

                    <Badge
                      bg="secondary"
                      pill
                    >
                      {user.id}
                    </Badge>

                  </Col>

                </Row>

              </div>

              {/* =========================
                  ACTION BUTTONS
              ========================= */}

              <div className="d-grid gap-3">

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() =>
                    navigate("/orders")
                  }
                >
                  📦 My Orders
                </Button>

                <Button
                  variant="outline-danger"
                  size="lg"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </Button>

              </div>

            </Card.Body>

          </Card>

        </Col>

      </Row>
    </Container>
  );
}

export default Profile;