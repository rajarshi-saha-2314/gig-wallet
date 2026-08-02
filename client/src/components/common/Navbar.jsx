import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav>
      <strong>gig-wallet</strong>
      {user ? (
        <>
          <Link to="/">Dashboard</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/settings">Settings</Link>
          <button type="button" onClick={handleLogout}>
            Log Out
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Log In</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
