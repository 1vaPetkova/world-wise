import { NavLink, useNavigate } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "../components/Logo";
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "./Button";

function PageNav() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  function handleClick(e) {
    e.preventDefault();
    logout();
    navigate("/");
  }
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          {!isAuthenticated ? (
            <NavLink to="/login" className={styles.ctaLink}>
              login
            </NavLink>
          ) : (
            <Button type="primary" onClick={handleClick}>
              logout
            </Button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
