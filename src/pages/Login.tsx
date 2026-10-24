import { useState } from "react";

import {
  Button,
  Card,
  Container,
  Form,
  Spinner,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import useApi from "../hooks/useApi";

import {
  deleteCurrentUser,
  getCurrentUsers,
  loginUser,
  saveCurrentUser,
} from "../services/userService";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // =====================================
  // LOGIN API
  // =====================================

  const {
    loading,
    callAPI: loginUserAPI,
  } = useApi(loginUser);

  // =====================================
  // GET CURRENT USERS API
  // =====================================

  const {
    callAPI: getCurrentUsersAPI,
  } = useApi(getCurrentUsers);

  // =====================================
  // DELETE CURRENT USER API
  // =====================================

  const {
    callAPI: deleteCurrentUserAPI,
  } = useApi(deleteCurrentUser);

  // =====================================
  // SAVE CURRENT USER API
  // =====================================

  const {
    callAPI: saveCurrentUserAPI,
  } = useApi(saveCurrentUser);

  // =====================================
  // HANDLE LOGIN
  // =====================================

  const handleLogin = async () => {

    // Check empty fields
    if (!email || !password) {

      alert(
        "Please enter email and password"
      );

      return;
    }

    try {

      // STEP 1
      // Find and validate user

      const foundUser =
        await loginUserAPI({
          email,
          password,
        });

      // STEP 2
      // Get old current users

      const currentUsers =
        await getCurrentUsersAPI();

      // STEP 3
      // Delete old current users

      await Promise.all(
        currentUsers.map(
          (currentUser) =>
            deleteCurrentUserAPI(
              currentUser.id
            )
        )
      );

      // STEP 4
      // Save new current user

      await saveCurrentUserAPI(
        foundUser
      );

      // STEP 5
      // Save in AuthContext

      login(foundUser);

      alert(
        `Welcome ${foundUser.name}!`
      );

      // STEP 6
      // Navigate

      navigate("/");

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";

      alert(message);

    }
  };

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
        className="shadow border-0"
        style={{
          width: "100%",
          maxWidth: "450px",
        }}
      >

        <Card.Body className="p-4 p-md-5">

          {/* TITLE */}

          <div className="text-center mb-4">

            <h1 className="h2 fw-bold">
              Welcome Back 👋
            </h1>

            <p className="text-muted mb-0">
              Login to continue shopping
            </p>

          </div>

          {/* EMAIL */}

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
            />

          </Form.Group>

          {/* PASSWORD */}

          <Form.Group className="mb-4">

            <Form.Label>
              Password
            </Form.Label>

            <Form.Control
              type="password"
              size="lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </Form.Group>

          {/* LOGIN BUTTON */}

          <Button
            variant="primary"
            size="lg"
            className="w-100 mb-4"
            onClick={handleLogin}
            disabled={loading}
          >

            {loading ? (

              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                />

                Logging in...

              </>

            ) : (

              "Login"

            )}

          </Button>

          {/* REGISTER */}

          <div className="text-center">

            <span className="text-muted">
              Don't have an account?{" "}
            </span>

            <Button
              variant="link"
              className="
                p-0
                text-decoration-none
              "
              onClick={() =>
                navigate("/register")
              }
            >
              Register
            </Button>

          </div>

        </Card.Body>

      </Card>

    </Container>
  );
}

export default Login;