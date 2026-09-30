import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Icon } from "../components/common/UI";

export default function ProtectedRoute({ role, children }) {
  const { user, signIn } = useAuth();
  const location = useLocation();

  if (user?.role === role) return children;

  return (
    <main className="access-page">
      <Card className="access-card">
        <span className="access-icon"><Icon name="lock" /></span>
        <p className="eyebrow">A secure space for your care</p>
        <h1>Sign in to continue</h1>
        <p className="muted">
          This {role} area is protected. Sign in, or preview the screen with a
          sample {role} account.
        </p>
        <div className="stack-actions">
          <Button as={Link} to={`/login?next=${encodeURIComponent(location.pathname)}`} full>
            Sign in
          </Button>
          <Button
            variant="secondary"
            full
            onClick={() => signIn({
              name: role === "doctor" ? "Dr. Priya Sharma" : "Aarav Mehta",
              email: role === "doctor" ? "priya.sharma@example.com" : "aarav@example.com",
              role,
            })}
          >
            Continue with a demo {role} account
          </Button>
        </div>
      </Card>
    </main>
  );
}
