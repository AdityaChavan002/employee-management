import { Link, NavLink } from "react-router-dom";
import { Button, Icon } from "../components/common/UI";

const items = [
  ["/doctor/dashboard", "Dashboard", "calendar"],
  ["/doctor/availability", "Availability", "clock"],
  ["/doctor/profile/edit", "My profile", "user"],
  ["/doctor/verification", "Verification", "shield"],
];

export default function DoctorLayout({ children }) {
  return (
    <div className="doctor-workspace">
      <aside className="doctor-sidebar">
        <Link className="brand" to="/doctor/dashboard">
          <span className="brand-mark"><Icon name="heart" /></span>
          <span><strong>HealthCare Connect</strong><small>Doctor portal</small></span>
        </Link>
        <p className="sidebar-label">WORKSPACE</p>
        <nav aria-label="Doctor navigation" className="doctor-nav">
          {items.map(([path, label, icon]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `doctor-nav-link${isActive ? " active" : ""}`}>
              <Icon name={icon} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-help">
          <div className="help-icon"><Icon name="people" /></div>
          <strong>Need a hand?</strong>
          <p>Our care team is here to help you get started.</p>
          <Button as={Link} to="/about" variant="secondary" size="sm" full>Contact support</Button>
        </div>
        <Link to="/" className="sidebar-back">← Back to patient site</Link>
      </aside>
      <div className="doctor-main">
        <header className="doctor-topbar">
          <div><span className="doctor-topbar-label">DOCTOR PORTAL</span><strong>Good morning, Doctor</strong></div>
          <div className="doctor-topbar-user"><span className="mini-avatar">PS</span><span>Dr. Priya Sharma</span><Icon name="arrow" /></div>
        </header>
        <main className="doctor-content">{children}</main>
      </div>
    </div>
  );
}
