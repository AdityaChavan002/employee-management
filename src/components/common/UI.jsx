import { Link } from "react-router-dom";

const iconGlyphs = {
  heart: "♥",
  search: "⌕",
  pin: "⌖",
  calendar: "▦",
  clock: "◷",
  phone: "⌕",
  clinic: "⌂",
  home: "⌂",
  check: "✓",
  arrow: "→",
  shield: "⬡",
  lock: "▣",
  user: "○",
  star: "★",
  menu: "☰",
  mail: "✉",
  close: "×",
  plus: "+",
  upload: "↑",
  wallet: "▤",
  people: "♧",
  settings: "⚙",
};

export function Icon({ name, className = "" }) {
  return (
    <span aria-hidden="true" className={`icon ${className}`}>
      {iconGlyphs[name] || "·"}
    </span>
  );
}

export function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  full = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`button button-${variant} button-${size}${full ? " button-full" : ""}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Card({ children, className = "", ...props }) {
  return <section className={`card${className ? ` ${className}` : ""}`} {...props}>{children}</section>;
}

export function PageIntro({ eyebrow, title, description, action }) {
  return (
    <div className="page-intro">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="muted intro-copy">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  name,
  error,
  hint,
  as: Component = "input",
  children,
  className = "",
  ...props
}) {
  return (
    <label className={`field${className ? ` ${className}` : ""}`} htmlFor={name}>
      <span className="field-label">{label}</span>
      <Component
        id={name}
        name={name}
        className={error ? "input has-error" : "input"}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        {...props}
      >
        {children}
      </Component>
      {error && <span className="field-error" id={`${name}-error`}>{error}</span>}
      {!error && hint && <span className="field-hint" id={`${name}-hint`}>{hint}</span>}
    </label>
  );
}

export function Badge({ children, tone = "blue" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function DoctorAvatar({ doctor, size = "md" }) {
  return (
    <img
      className={`doctor-avatar avatar-${size}`}
      src={doctor.image}
      alt={`${doctor.name}, ${doctor.specialty}`}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

export function DoctorCard({ doctor }) {
  return (
    <Card className="doctor-card">
      <Link className="doctor-card-main" to={`/doctors/${doctor.id}`}>
        <DoctorAvatar doctor={doctor} />
        <div className="doctor-card-copy">
          <div className="doctor-name-row">
            <h3>{doctor.name}</h3>
            <span className="rating"><Icon name="star" /> {doctor.rating}</span>
          </div>
          <p>{doctor.specialty}</p>
          <p className="muted">{doctor.qualifications} · {doctor.experience} years experience</p>
          <p className="doctor-location"><Icon name="pin" /> {doctor.location}</p>
          <div className="tag-row">
            {doctor.services.map((service) => <Badge key={service}>{service}</Badge>)}
          </div>
        </div>
      </Link>
      <div className="doctor-card-footer">
        <span>From <strong>₹{doctor.fee}</strong> <small>/ visit</small></span>
        <Button as={Link} to={`/doctors/${doctor.id}`} size="sm">View profile</Button>
      </div>
    </Card>
  );
}

export function EmptyState({ icon = "calendar", title, description, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name={icon} /></span>
      <h3>{title}</h3>
      <p className="muted">{description}</p>
      {action}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}
