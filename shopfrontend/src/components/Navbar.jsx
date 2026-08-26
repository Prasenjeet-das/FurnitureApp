import { Link, useLocation, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import useWishlist from "../hooks/useWishlist";

function Navbar() {

  const navigate = useNavigate();
  useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const token = localStorage.getItem("token");

  let role = null;

  // ================================
  // GET ROLE FROM JWT
  // ================================

  if (token) {

    try {

      const tokenData = JSON.parse(
        atob(token.split(".")[1])
      );

      role = String(tokenData.role || "")
        .replace(/^ROLE_/, "")
        .toUpperCase();

    } catch {

      console.error("Invalid token");

      localStorage.removeItem("token");

    }
  }


  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    navigate("/login");

  };


  return (

    <nav className="navbar navbar-dark bg-dark">

      <div className="container">

        {/* ================================
            BRAND
        ================================= */}

        <Link className="navbar-brand" to="/">
          Furniture Shop
        </Link>

        <div className="navbar-actions is-open">
          <Link className="btn btn-light me-2" to="/">Home</Link>
          <Link className="btn btn-light me-2" to="/products">Products</Link>
          <Link className="btn btn-light me-2" to="/about">About</Link>
          {role === "USER" && <Link className="btn btn-light me-2" to="/cart">Cart ({cartCount})</Link>}
          {role === "USER" && <Link className="btn btn-light me-2" to="/wishlist">Wishlist ({wishlistCount})</Link>}
          {role === "ADMIN" && (
            <Link className="btn btn-warning me-2" to="/admin">
              Admin Dashboard
            </Link>
          )}
          {token && <Link className="btn btn-info me-2" to="/profile">My Account</Link>}
          {role === "USER" && <Link className="btn btn-light me-2" to="/orders">My Orders</Link>}
          {!token && <Link className="btn btn-warning" to="/login">Login</Link>}
          {token && <button className="btn btn-danger" onClick={handleLogout}>Logout</button>}
        </div>

      </div>

    </nav>

  );

}

export default Navbar;