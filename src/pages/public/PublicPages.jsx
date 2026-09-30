import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Card, DoctorAvatar, DoctorCard, EmptyState, Field, Icon, PageIntro, SectionHeading } from "../../components/common/UI";
import { doctorOptions, doctorService } from "../../services/mockApi";

const heroPhoto = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=90";

export function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><Icon name="shield" /> Care you can count on</span>
            <h1>Your health.<br /><span>Our priority.</span></h1>
            <p>Find trusted doctors near you and book the care you need, when you need it.</p>
            <form className="hero-search" onSubmit={(event) => { event.preventDefault(); navigate(`/search?q=${encodeURIComponent(query)}`); }}>
              <Icon name="pin" />
              <input aria-label="Search by doctor, specialty, or location" placeholder="Doctor, specialty, or location" value={query} onChange={(event) => setQuery(event.target.value)} />
              <Button type="submit"><Icon name="search" /> Search</Button>
            </form>
            <div className="hero-trust"><span><Icon name="check" /> Verified doctors</span><span><Icon name="check" /> Easy booking</span><span><Icon name="check" /> Care made personal</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-orbit" />
            <img src={heroPhoto} alt="Doctor ready to help" />
            <div className="hero-note"><span className="hero-note-icon"><Icon name="check" /></span><span><strong>Care starts here</strong><small>Book with confidence</small></span></div>
            <div className="hero-caption"><span className="caption-dot" /> A healthier you, one visit at a time</div>
          </div>
        </div>
      </section>

      <section className="content-section home-services">
        <SectionHeading eyebrow="Care that fits your life" title="Choose how you’d like to be seen" />
        <div className="service-grid">
          {[
            ["phone", "Phone consultation", "Talk to a doctor from wherever you are.", "From ₹300"],
            ["clinic", "Clinic visit", "Meet your doctor for in-person care.", "From ₹500"],
            ["home", "Home visit", "Get care in the comfort of home.", "Availability varies"],
          ].map(([icon, title, copy, price]) => (
            <Link to="/search" className="service-card" key={title}>
              <span className="service-icon"><Icon name={icon} /></span><h3>{title}</h3><p>{copy}</p><span className="service-price">{price} <Icon name="arrow" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section featured-section">
        <SectionHeading eyebrow="Trusted care, nearby" title="Meet some of our doctors" action={<Button as={Link} to="/search" variant="secondary">Browse all doctors <Icon name="arrow" /></Button>} />
        <div className="featured-grid">
          {doctorOptions.slice(0, 3).map((doctor) => <DoctorCard doctor={doctor} key={doctor.id} />)}
        </div>
      </section>

      <section className="care-banner content-section">
        <div><p className="eyebrow">For medical professionals</p><h2>Bring your care to more people.</h2><p>Join our network of verified doctors and make it easier for patients to find you.</p></div>
        <Button as={Link} to="/signup?role=doctor" variant="light">Join as a doctor <Icon name="arrow" /></Button>
      </section>
    </main>
  );
}

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState(params.get("q") || "");
  const [specialty, setSpecialty] = useState("All specialties");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    doctorService.list({ query: params.get("q") || "", specialty })
      .then((results) => { if (active) { setDoctors(results); setError(""); } })
      .catch(() => { if (active) setError("We couldn’t load doctors. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [params, specialty]);

  return (
    <main className="page-container">
      <PageIntro eyebrow="Find your doctor" title="The right care starts here" description="Search verified doctors and find an appointment that works for you." />
      <form className="search-toolbar" onSubmit={(event) => { event.preventDefault(); setParams(query.trim() ? { q: query.trim() } : {}); }}>
        <label className="search-field"><Icon name="search" /><input aria-label="Search doctors" placeholder="Search by name, specialty, or location" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <select aria-label="Filter by specialty" className="input" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
          <option>All specialties</option><option>Cardiologist</option><option>Dermatologist</option><option>Pediatrician</option>
        </select>
        <Button type="submit">Search doctors</Button>
      </form>
      <div className="results-heading"><div><h2>{loading ? "Finding doctors…" : `${doctors.length} doctors near you`}</h2><p className="muted"><Icon name="pin" /> Bengaluru, India</p></div><Button variant="ghost" size="sm"><Icon name="settings" /> Filters</Button></div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {loading ? <div className="loading-card"><span className="spinner" /> Loading doctors near you…</div> : doctors.length ? <div className="results-list">{doctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}</div> : <Card><EmptyState icon="search" title="No doctors found" description="Try a different name, specialty, or location." action={<Button variant="secondary" onClick={() => { setQuery(""); setSpecialty("All specialties"); setParams({}); }}>Clear search</Button>} /></Card>}
    </main>
  );
}

export function DoctorProfilePage() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(() => doctorOptions.find((item) => item.id === doctorId) || null);
  const [loading, setLoading] = useState(!doctor);
  useEffect(() => {
    let active = true;
    doctorService.getById(doctorId).then((result) => { if (active) setDoctor(result); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [doctorId]);

  if (loading) return <main className="page-container"><div className="loading-card"><span className="spinner" /> Loading doctor profile…</div></main>;
  if (!doctor) return <main className="page-container"><EmptyState title="Doctor not found" description="This profile may no longer be available." action={<Button as={Link} to="/search">Find a doctor</Button>} /></main>;
  return (
    <main className="page-container profile-page">
      <div className="breadcrumb"><Link to="/search">Find a doctor</Link><span>›</span><span>{doctor.name}</span></div>
      <Card className="profile-hero-card">
        <div className="profile-summary"><DoctorAvatar doctor={doctor} size="lg" /><div className="profile-summary-copy"><span className="verified-label"><Icon name="check" /> Verified profile</span><h1>{doctor.name}</h1><p className="profile-specialty">{doctor.specialty} <span>·</span> {doctor.qualifications}</p><div className="profile-facts"><span><Icon name="star" /> {doctor.rating} <small>({doctor.reviews} reviews)</small></span><span><Icon name="clock" /> {doctor.experience} years experience</span><span><Icon name="pin" /> {doctor.location}</span></div></div></div>
        <aside className="profile-booking-box"><p className="muted">Consultation from</p><strong className="profile-fee">₹{doctor.fee}</strong><span className="availability"><Icon name="check" /> Available {doctor.nextAvailable}</span><Button as={Link} to={`/booking/${doctor.id}`} full>Book an appointment <Icon name="arrow" /></Button><small>Choose phone, clinic, or home visit</small></aside>
      </Card>
      <div className="profile-details-grid">
        <Card><h2>About {doctor.name.split(" ")[1]}</h2><p className="body-copy">{doctor.bio}</p><h3>Specialties</h3><div className="tag-row">{doctor.services.map((service) => <span className="tag" key={service}>{service}</span>)}</div><h3>Languages spoken</h3><p className="body-copy">{doctor.languages.join(" · ")}</p></Card>
        <Card className="profile-practice"><h2>Practice information</h2><div className="practice-line"><span className="service-icon small"><Icon name="pin" /></span><div><strong>Clinic location</strong><p className="muted">{doctor.location}</p></div></div><div className="practice-line"><span className="service-icon small"><Icon name="calendar" /></span><div><strong>Next available</strong><p className="muted">{doctor.nextAvailable}</p></div></div><div className="practice-line"><span className="service-icon small"><Icon name="wallet" /></span><div><strong>Consultation fee</strong><p className="muted">From ₹{doctor.fee}</p></div></div></Card>
      </div>
    </main>
  );
}

export function AboutPage() {
  const [sent, setSent] = useState(false);
  return (
    <main className="page-container">
      <section className="about-hero"><div><p className="eyebrow">About HealthCare Connect</p><h1>Better care begins with a better connection.</h1><p className="muted">We make it easier to find trusted doctors and book care that fits into your life.</p></div><div className="about-illustration"><span className="about-cross">+</span><div className="about-mini-card"><Icon name="heart" /><strong>Care, connected.</strong><small>Here for your health journey</small></div><span className="about-orb" /></div></section>
      <section className="about-values"><div><span className="value-number">01</span><h2>People first</h2><p>Every patient deserves to feel heard, respected, and supported.</p></div><div><span className="value-number">02</span><h2>Trusted care</h2><p>We help connect patients with medical professionals and their care.</p></div><div><span className="value-number">03</span><h2>Simple by design</h2><p>Finding and booking an appointment should feel straightforward.</p></div></section>
      <section className="contact-section"><div><p className="eyebrow">We’re here for you</p><h2>Get in touch</h2><p className="muted">Questions about the platform? Send us a note and our team will be in touch.</p><div className="contact-detail"><Icon name="mail" /><span><strong>Email us</strong><small>hello@healthcareconnect.example</small></span></div><div className="contact-detail"><Icon name="clock" /><span><strong>Support hours</strong><small>Monday – Saturday, 9:00 AM – 6:00 PM</small></span></div></div><Card className="contact-form-card">{sent ? <EmptyState icon="check" title="Message received" description="Thanks for reaching out. Our team will be in touch." /> : <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}><h3>Send us a message</h3><Field label="Your name" name="contact-name" placeholder="Jane Smith" required /><Field label="Email address" name="contact-email" type="email" placeholder="jane@example.com" required /><Field label="How can we help?" name="contact-message" as="textarea" rows="4" placeholder="Write your message…" required /><Button type="submit" full>Send message <Icon name="arrow" /></Button></form>}</Card></section>
    </main>
  );
}

export function PoliciesPage() {
  return (
    <main className="page-container policies-page">
      <PageIntro eyebrow="The important details" title="Policies & terms" description="Clear information about how HealthCare Connect works and how we look after your information." />
      <div className="policies-grid">
        <nav className="policy-nav" aria-label="Policy sections"><a href="#privacy">Privacy policy</a><a href="#terms">Terms of service</a><a href="#cancellations">Cancellations</a><a href="#disclaimer">Medical disclaimer</a><a href="#data">Data security</a></nav>
        <div className="policy-content">
          <Card id="privacy"><h2>Privacy policy</h2><p>We use the information you provide to help you find doctors and manage your appointments. Your details are used to support your care journey and to communicate important booking updates.</p><ul><li>We only request information needed to provide the platform experience.</li><li>Appointment and account information is handled with care.</li><li>You can contact our team to ask about your account information.</li></ul><p className="muted">This is a product preview. Final privacy terms will be provided before launch.</p></Card>
          <Card id="terms"><h2>Terms of service</h2><p>HealthCare Connect helps patients discover doctors and request appointments. Doctor availability, services, and fees are provided as illustrative information in this preview and may vary.</p><p>Use of this platform does not establish a doctor-patient relationship until you have consulted with a medical professional.</p></Card>
          <Card id="cancellations"><h2>Cancellations & appointments</h2><p>Appointment changes and cancellation options depend on the doctor and appointment type. Please use your appointment details to contact the clinic if you need to make a change.</p></Card>
          <Card id="disclaimer"><h2>Medical disclaimer</h2><p>This platform is not an emergency service and does not provide medical advice. If you believe you are experiencing an emergency, contact your local emergency services.</p></Card>
          <Card id="data"><h2>Data security</h2><p>Account access is designed to be protected. Do not share verification codes or sign-in credentials with anyone. This preview uses local demo data and does not submit information to a backend service.</p></Card>
        </div>
      </div>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="not-found">
      <div className="not-found-art"><span>404</span><Icon name="search" /></div>
      <p className="eyebrow">Oops, we lost that page</p>
      <h1>We can’t find that page.</h1>
      <p className="muted">The page may have moved or the address may be incorrect. Let’s get you back on track.</p>
      <Button as={Link} to="/">Back to home <Icon name="arrow" /></Button>
    </main>
  );
}
