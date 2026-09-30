import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Icon } from "../components/common/UI";

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/">
            <span className="brand-mark"><Icon name="heart" /></span>
            <span><strong>HealthCare Connect</strong><small>Better care, healthier tomorrow</small></span>
          </Link>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
          <nav className={`main-nav${menuOpen ? " nav-open" : ""}`} aria-label="Main navigation">
            <NavLink to="/search" onClick={() => setMenuOpen(false)}>Find a doctor</NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>About us</NavLink>
            <NavLink to="/policies" onClick={() => setMenuOpen(false)}>Policies</NavLink>
            {user?.role === "patient" && <NavLink to="/appointments" onClick={() => setMenuOpen(false)}>My appointments</NavLink>}
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <span className="header-greeting">Hi, {user.name.split(" ")[0]}</span>
                <Button variant="secondary" size="sm" onClick={signOut}>Sign out</Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="ghost" size="sm">Log in</Button>
                <Button as={Link} to="/signup" size="sm">Get started</Button>
              </>
            )}
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div className="footer-inner">
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark"><Icon name="heart" /></span>
            <span><strong>HealthCare Connect</strong><small>Care that comes together.</small></span>
          </Link>
          <p>Helping you find the right care, close to home.</p>
          <div className="footer-links"><Link to="/about">About</Link><Link to="/policies">Policies</Link><Link to="/signup?role=doctor">For doctors</Link></div>
          <small>© 2026 HealthCare Connect</small>
        </div>
      </footer>
    </div>
  );
}
