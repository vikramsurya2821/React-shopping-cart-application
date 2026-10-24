import {
  Badge,
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

interface DashboardHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  cartCount: number;
  user: {
    name: string;
  } | null;
}

function DashboardHeader({
  search,
  setSearch,
  cartCount,
  user,
}: DashboardHeaderProps) {

  const navigate = useNavigate();

  const { logout } = useAuth();

  const { wishlist } = useWishlist();

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {

    logout();

    navigate("/");

  };

  return (
    <header className="bg-white border-bottom sticky-top">

      <Container fluid>

        <Row className="align-items-center py-3">

          {/* =====================
              LOGO
          ===================== */}

          <Col
            xs={12}
            lg={2}
            className="mb-2 mb-lg-0"
          >

            <Button
              variant="link"
              className="text-decoration-none fs-3 fw-bold text-dark p-0"
              onClick={() => navigate("/")}
            >
              BuyNest
            </Button>

          </Col>

          {/* =====================
              SEARCH
          ===================== */}

          <Col
            xs={12}
            lg={5}
            className="mb-2 mb-lg-0"
          >

            <Form.Control
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </Col>

          {/* =====================
              WISHLIST + CART + USER
          ===================== */}

          <Col xs={12} lg={5}>

            <div className="d-flex justify-content-lg-end gap-2">

              {/* WISHLIST */}

              <Button
                variant="outline-danger"
                className="position-relative"
                onClick={() =>
                  navigate("/wishlist")
                }
              >
                ♡ Wishlist

                {wishlist.length > 0 && (

                  <Badge
                    bg="danger"
                    pill
                    className="
                      position-absolute
                      top-0
                      start-100
                      translate-middle
                    "
                  >
                    {wishlist.length}
                  </Badge>

                )}

              </Button>

              {/* CART */}

              <Button
                variant="outline-dark"
                className="position-relative"
                onClick={() =>
                  navigate("/cart")
                }
              >
                🛒 Cart

                {cartCount > 0 && (

                  <Badge
                    bg="danger"
                    pill
                    className="
                      position-absolute
                      top-0
                      start-100
                      translate-middle
                    "
                  >
                    {cartCount}
                  </Badge>

                )}

              </Button>

              {/* USER DROPDOWN */}

              {user ? (

                <Dropdown align="end">

                  <Dropdown.Toggle
                    variant="primary"
                    id="user-dropdown"
                  >
                    👤 {user.name}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>

                    <Dropdown.Item
                      onClick={() =>
                        navigate("/profile")
                      }
                    >
                      👤 My Profile
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() =>
                        navigate("/orders")
                      }
                    >
                      📦 My Orders
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item
                      className="text-danger"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </Dropdown.Item>

                  </Dropdown.Menu>

                </Dropdown>

              ) : (

                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  Login
                </Button>

              )}

            </div>

          </Col>

        </Row>

      </Container>

    </header>
  );
}

export default DashboardHeader;