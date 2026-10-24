import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Spinner,
} from "react-bootstrap";

import useApi from "../hooks/useApi";

import {
  registerUser,
} from "../services/userService";

function Register() {

  const navigate = useNavigate();

  // ================================
  // FORM STATE
  // ================================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // ================================
  // REGISTER API
  // ================================

  const {
    loading,
    error,
    callAPI: registerUserAPI,
  } = useApi(registerUser);

  // ================================
  // HANDLE REGISTER
  // ================================

  const handleRegister = async () => {

    // EMPTY FIELD CHECK

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    try {

      // REGISTER USER

      await registerUserAPI({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      alert(
        "Registration successful!"
      );

      // GO TO LOGIN

      navigate("/login");

    } catch (error) {

      console.error(
        "Register error:",
        error
      );

    }
  };

  // ================================
  // UI
  // ================================

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
          shadow
          border-0
        "
        style={{
          width: "100%",
          maxWidth: "500px",
        }}
      >

        <Card.Body
          className="
            p-4
            p-md-5
          "
        >

          {/* =====================
              TITLE
          ===================== */}

          <div className="text-center mb-4">

            <div className="display-4 mb-3">
              🚀
            </div>

            <h1 className="h2 fw-bold">
              Create Account
            </h1>

            <p className="text-muted mb-0">
              Create your BuyNest account and start shopping
            </p>

          </div>

          {/* =====================
              ERROR
          ===================== */}

          {error && (

            <Alert
              variant="danger"
              className="mb-4"
            >
              {error}
            </Alert>

          )}

          {/* =====================
              NAME
          ===================== */}

          <Form.Group className="mb-3">

            <Form.Label>
              Full Name
            </Form.Label>

            <Form.Control
              type="text"
              size="lg"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              disabled={loading}
            />

          </Form.Group>

          {/* =====================
              EMAIL
          ===================== */}

          <Form.Group className="mb-3">

            <Form.Label>
              Email Address
            </Form.Label>

            <Form.Control
              type="email"
              size="lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              disabled={loading}
            />

          </Form.Group>

          {/* =====================
              PASSWORD
          ===================== */}

          <Form.Group className="mb-4">

            <Form.Label>
              Password
            </Form.Label>

            <Form.Control
              type="password"
              size="lg"
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              disabled={loading}
            />

          </Form.Group>

          {/* =====================
              REGISTER BUTTON
          ===================== */}

          <Button
            variant="primary"
            size="lg"
            className="w-100 mb-4"
            onClick={handleRegister}
            disabled={loading}
          >

            {loading ? (

              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                />

                Registering...

              </>

            ) : (

              "Create Account"

            )}

          </Button>

          {/* =====================
              LOGIN
          ===================== */}

          <div className="text-center">

            <span className="text-muted">

              Already have an account?{" "}

            </span>

            <Button
              variant="link"
              className="
                p-0
                text-decoration-none
              "
              disabled={loading}
              onClick={() =>
                navigate("/login")
              }
            >

              Login

            </Button>

          </div>

        </Card.Body>

      </Card>

    </Container>
  );
}

export default Register;