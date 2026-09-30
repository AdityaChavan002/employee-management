import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, Field, Icon } from "../../components/common/UI";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/mockApi";

function AuthFrame({ children, title, copy, step }) {
  return (
    <main className="auth-page">
      <section className="auth-story">
        <Link to="/" className="brand"><span className="brand-mark"><Icon name="heart" /></span><span><strong>HealthCare Connect</strong><small>Better care, healthier tomorrow</small></span></Link>
        <div className="auth-story-content"><span className="story-kicker"><Icon name="shield" /> CARE THAT CONNECTS</span><h1>Good health starts with the right support.</h1><p>Find trusted doctors. Book care that works for you. Feel better, one step at a time.</p><div className="story-proof"><span className="proof-avatars"><i>PS</i><i>RM</i><i>AR</i></span><span><strong>Care made personal</strong><small>Here for your health journey</small></span></div></div>
        <div className="auth-story-foot"><span><Icon name="check" /> Trusted care</span><span><Icon name="check" /> Easy booking</span><span><Icon name="check" /> Here for you</span></div>
      </section>
      <section className="auth-content">
        <div className="auth-topline">{step && <span>{step}</span>}<span>Secure access <Icon name="lock" /></span></div>
        <Card className="auth-card"><div className="auth-heading"><span className="auth-icon"><Icon name="heart" /></span><h2>{title}</h2><p className="muted">{copy}</p></div>{children}</Card>
        <p className="auth-legal">By continuing, you agree to our <Link to="/policies">Terms of service</Link> and <Link to="/policies">Privacy policy</Link>.</p>
      </section>
    </main>
  );
}

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get("role") === "doctor" ? "doctor" : "patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const user = await authService.signIn({ email: data.get("email"), role });
      signIn(user);
      navigate(params.get("next") || (role === "doctor" ? "/doctor/dashboard" : "/appointments"));
    } catch {
      setError("We couldn’t sign you in. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthFrame title="Welcome back" copy="Sign in to continue to your account.">
      <div className="role-switch" role="group" aria-label="Account type">
        <button type="button" className={role === "patient" ? "selected" : ""} onClick={() => setRole("patient")}><Icon name="user" /> Patient</button>
        <button type="button" className={role === "doctor" ? "selected" : ""} onClick={() => setRole("doctor")}><Icon name="heart" /> Doctor</button>
      </div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <form className="form-stack" onSubmit={submit}>
        <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <Field label="Password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" minLength="6" required />
        <div className="form-between"><label className="check-label"><input type="checkbox" /> Remember me</label><Link to="/reset-password">Forgot password?</Link></div>
        <Button type="submit" full disabled={loading}>{loading ? "Signing in…" : "Sign in"} <Icon name="arrow" /></Button>
      </form>
      <p className="auth-switch-copy">New to HealthCare Connect? <Link to="/signup">Create an account</Link></p>
      <div className="auth-demo-note"><Icon name="shield" /> Demo preview — use any valid email and password.</div>
    </AuthFrame>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get("role") === "doctor" ? "doctor" : "patient");
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    if (form.get("password") !== form.get("confirm-password")) {
      setError("Your passwords don’t match. Please try again.");
      return;
    }
    try {
      const account = await authService.signUp({ name: form.get("name"), email: form.get("email"), role });
      sessionStorage.setItem("healthcare-connect-pending-user", JSON.stringify(account));
      navigate("/verify-otp");
    } catch {
      setError("We couldn’t create your account. Please try again.");
    }
  }
  return (
    <AuthFrame title="Create your account" copy={role === "doctor" ? "Start your journey with HealthCare Connect." : "A little closer to the care you need."} step="STEP 1 OF 2">
      <div className="role-switch" role="group" aria-label="Create account as">
        <button type="button" className={role === "patient" ? "selected" : ""} onClick={() => setRole("patient")}><Icon name="user" /> Patient</button>
        <button type="button" className={role === "doctor" ? "selected" : ""} onClick={() => setRole("doctor")}><Icon name="heart" /> Doctor</button>
      </div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <form className="form-stack" onSubmit={submit}>
        <Field label={role === "doctor" ? "Full name (as on registration)" : "Full name"} name="name" autoComplete="name" placeholder="Your full name" required minLength="2" />
        <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <Field label="Phone number" name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" pattern="[+0-9 ()-]{8,18}" required />
        <Field label="Create password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" minLength="8" required />
        <Field label="Confirm password" name="confirm-password" type="password" autoComplete="new-password" placeholder="Re-enter your password" minLength="8" required />
        <label className="check-label consent"><input type="checkbox" required /> I agree to the <Link to="/policies">Terms of service</Link> and <Link to="/policies">Privacy policy</Link>.</label>
        <Button type="submit" full>Create account <Icon name="arrow" /></Button>
      </form>
      <p className="auth-switch-copy">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthFrame>
  );
}

export function VerifyOtpPage() {
  const { signIn } = useAuth();
  const pending = JSON.parse(sessionStorage.getItem("healthcare-connect-pending-user") || "null");
  const [code, setCode] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await authService.verifyOtp(code.join(""));
      setVerified(true);
      if (pending) {
        signIn(pending);
        sessionStorage.removeItem("healthcare-connect-pending-user");
      }
    } catch (requestError) {
      setError(requestError.message || "We couldn’t verify that code. Please try again.");
    }
  }
  if (verified) {
    return <AuthFrame title="You’re all set!" copy="Your email address has been verified."><span className="success-orb"><Icon name="check" /></span><p className="success-message">Your account is ready. Let’s take you to the next step.</p><Button as={Link} to={pending?.role === "doctor" ? "/doctor/onboarding" : "/appointments"} full>Continue <Icon name="arrow" /></Button></AuthFrame>;
  }
  return (
    <AuthFrame title="Verify your email" copy={pending?.email ? `We sent a 6-digit verification code to ${pending.email}.` : "Enter the 6-digit code we sent to your email address."} step="STEP 2 OF 2">
      <div className="otp-illustration"><span className="otp-envelope"><Icon name="mail" /></span><span className="otp-sparkle">✦</span></div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <form onSubmit={submit}>
        <div className="otp-inputs" aria-label="6-digit verification code">
          {code.map((digit, index) => <input key={index} className="otp-input" aria-label={`Verification digit ${index + 1}`} inputMode="numeric" maxLength="1" value={digit} onChange={(event) => setCode(code.map((value, i) => i === index ? event.target.value.replace(/\D/g, "") : value))} required />)}
        </div>
        <p className="otp-help">Demo code: <strong>123456</strong></p>
        <Button type="submit" full>Verify email <Icon name="arrow" /></Button>
      </form>
      <p className="auth-switch-copy">Didn’t get a code? <button className="text-button" type="button" onClick={() => setError("A new demo code has been sent.")}>Resend code</button></p>
    </AuthFrame>
  );
}

export function ResetPasswordPage() {
  const [sent, setSent] = useState(false);
  return (
    <AuthFrame title={sent ? "Check your inbox" : "Reset your password"} copy={sent ? "If there’s an account for that address, you’ll receive a reset link shortly." : "Enter the email address linked to your account and we’ll send you a reset link."}>
      {sent ? <><span className="success-orb"><Icon name="mail" /></span><Button as={Link} to="/login" full>Back to sign in <Icon name="arrow" /></Button></> : <form className="form-stack" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><Field label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /><Button type="submit" full>Send reset link <Icon name="arrow" /></Button></form>}
      <p className="auth-switch-copy"><Link to="/login">← Back to sign in</Link></p>
      <p className="auth-demo-note"><Icon name="shield" /> Demo preview — no email will be sent.</p>
    </AuthFrame>
  );
}
