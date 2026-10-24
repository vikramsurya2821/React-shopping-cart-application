import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import "./Header.css";

interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

function Header({ search, setSearch }: HeaderProps) {
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const [showMenu, setShowMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Outside click -> close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/login");
  };

  return (
    <header className="header">

      {/* Top Header */}
      <div className="header-top">

        {/* Logo */}
        <div
          className="logo"
          onClick={() => navigate("/")}
        >
          🛒 <span>BuyNest</span>
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="search-btn">
            🔍
          </button>
        </div>

        {/* Right Side */}
        <div className="header-right">

          {user ? (
            /* PROFILE */
            <div className="profile-container" ref={profileRef}>

              <button
  className="profile-button"
  onClick={() => setShowMenu(!showMenu)}
>
  👤 {user.name}
  <span className="profile-arrow">
    {showMenu ? "▲" : "▼"}
  </span>
</button>

              {showMenu && (
                <div className="profile-dropdown">

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/profile");
                    }}
                  >
                    👤 My Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/orders");
                    }}
                  >
                    📦 My Orders
                  </button>

                  <div className="dropdown-line"></div>

                  <button
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>

                </div>
              )}
            </div>
          ) : (
            <button
              className="login-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          )}

          {/* Cart */}
          <button
            className="cart-button"
            onClick={() => navigate("/cart")}
          >
            🛒 Cart
            <span className="cart-count">{cartCount}</span>
          </button>

        </div>
      </div>

    

    </header>
  );
}

export default Header;