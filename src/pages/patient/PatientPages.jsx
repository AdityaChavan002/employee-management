import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, DoctorAvatar, EmptyState, Field, Icon, PageIntro } from "../../components/common/UI";
import { appointmentService, doctorOptions, paymentService } from "../../services/mockApi";

const draftKey = "healthcare-connect-booking-draft";
const appointmentTypes = [
  { id: "Phone", icon: "phone", title: "Phone consultation", copy: "Speak with your doctor by phone." },
  { id: "Clinic Visit", icon: "clinic", title: "Clinic visit", copy: "Meet your doctor in person." },
  { id: "Home Visit", icon: "home", title: "Home visit", copy: "Have your doctor come to you." },
];
const appointmentDates = [
  { day: "Thu", number: "01", month: "Oct" },
  { day: "Fri", number: "02", month: "Oct" },
  { day: "Sat", number: "03", month: "Oct" },
  { day: "Sun", number: "04", month: "Oct" },
  { day: "Mon", number: "05", month: "Oct" },
];
const appointmentTimes = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM", "06:00 PM"];

function readDraft() {
  try { return JSON.parse(sessionStorage.getItem(draftKey) || "null"); } catch { return null; }
}

function Stepper({ current, labels }) {
  return <ol className="stepper">{labels.map((label, index) => <li key={label} className={index < current ? "complete" : index === current ? "current" : ""}><span className="step-number">{index < current ? <Icon name="check" /> : index + 1}</span><span>{label}</span></li>)}</ol>;
}

export function BookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctor = doctorOptions.find((item) => item.id === doctorId) || doctorOptions[0];
  const [draft, setDraft] = useState(() => readDraft()?.doctorId === doctorId ? readDraft() : { doctorId, doctorName: doctor.name, specialty: doctor.specialty, image: doctor.image, fee: doctor.fee, location: doctor.location });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => { sessionStorage.setItem(draftKey, JSON.stringify(draft)); }, [draft]);

  const labels = ["Appointment type", "Date & time", "Patient details", "Review"];
  function next() {
    setError("");
    if (step === 0 && !draft.type) return setError("Choose how you’d like to meet your doctor.");
    if (step === 1 && (!draft.date || !draft.time)) return setError("Choose a date and an available time.");
    if (step === 2 && (!draft.patientName || !draft.phone || !draft.email)) return setError("Add your name, phone number, and email to continue.");
    if (step < labels.length - 1) setStep(step + 1);
    else navigate("/payment");
  }
  return (
    <main className="page-container booking-page">
      <div className="breadcrumb"><Link to={`/doctors/${doctor.id}`}>{doctor.name}</Link><span>›</span><span>Book an appointment</span></div>
      <PageIntro eyebrow="Your care, your way" title="Book an appointment" description="A few quick details and you’ll be on your way." />
      <Stepper current={step} labels={labels} />
      <div className="booking-layout">
        <Card className="booking-form-card">
          {step === 0 && <><h2>How would you like to meet?</h2><p className="muted">Choose the appointment type that feels right for you.</p><div className="appointment-type-grid">{appointmentTypes.map((type) => <button type="button" key={type.id} className={`appointment-type-card${draft.type === type.id ? " selected" : ""}`} aria-pressed={draft.type === type.id} onClick={() => setDraft({ ...draft, type: type.id })}><span className="service-icon"><Icon name={type.icon} /></span><strong>{type.title}</strong><small>{type.copy}</small></button>)}</div></>}
          {step === 1 && <><h2>Pick a date & time</h2><p className="muted">Available times for {doctor.name}</p><div className="date-picker-row">{appointmentDates.map((date) => <button type="button" key={date.number} className={`date-option${draft.date === `${date.month} ${date.number}, 2026` ? " selected" : ""}`} onClick={() => setDraft({ ...draft, date: `${date.month} ${date.number}, 2026` })}><small>{date.day}</small><strong>{date.number}</strong><span>{date.month}</span></button>)}</div><h3 className="time-heading">Available times</h3><div className="time-grid">{appointmentTimes.map((time) => <button type="button" key={time} className={`time-option${draft.time === time ? " selected" : ""}`} onClick={() => setDraft({ ...draft, time })}>{time}</button>)}</div></>}
          {step === 2 && <><h2>Who is this appointment for?</h2><p className="muted">Share a few details so the doctor can prepare for your visit.</p><div className="form-stack booking-fields"><Field label="Patient’s full name" name="patient-name" value={draft.patientName || ""} onChange={(event) => setDraft({ ...draft, patientName: event.target.value })} placeholder="Your full name" required /><Field label="Phone number" name="patient-phone" type="tel" value={draft.phone || ""} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} placeholder="+91 98765 43210" required /><Field label="Email address" name="patient-email" type="email" value={draft.email || ""} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="you@example.com" required /><Field label="A note for your doctor (optional)" name="patient-note" as="textarea" rows="3" value={draft.note || ""} onChange={(event) => setDraft({ ...draft, note: event.target.value })} placeholder="Anything you’d like them to know?" /></div></>}
          {step === 3 && <><h2>Review your appointment</h2><p className="muted">Please check your details before you continue to payment.</p><div className="review-doctor"><DoctorAvatar doctor={doctor} /><div><strong>{doctor.name}</strong><p className="muted">{doctor.specialty}</p></div></div><div className="review-lines"><div><span>Appointment type</span><strong>{draft.type}</strong></div><div><span>Date & time</span><strong>{draft.date} · {draft.time}</strong></div><div><span>Patient</span><strong>{draft.patientName}</strong></div><div><span>Contact</span><strong>{draft.phone} · {draft.email}</strong></div>{draft.note && <div><span>Note</span><strong>{draft.note}</strong></div>}</div></>}
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <div className="booking-actions">{step > 0 && <Button variant="secondary" onClick={() => { setError(""); setStep(step - 1); }}>Back</Button>}<Button onClick={next}>{step === labels.length - 1 ? "Continue to payment" : "Continue"} <Icon name="arrow" /></Button></div>
        </Card>
        <Card className="booking-summary"><p className="eyebrow">YOUR DOCTOR</p><div className="review-doctor"><DoctorAvatar doctor={doctor} /><div><strong>{doctor.name}</strong><p className="muted">{doctor.specialty}</p></div></div><div className="summary-line"><span>Appointment fee</span><strong>₹{doctor.fee}</strong></div><div className="summary-line"><span>Booking charge</span><strong>₹0</strong></div><div className="summary-total"><span>Total</span><strong>₹{doctor.fee}</strong></div><p className="secure-note"><Icon name="shield" /> Your details are kept private and secure.</p></Card>
      </div>
    </main>
  );
}

export function PaymentPage() {
  const navigate = useNavigate();
  const draft = readDraft() || { doctorId: doctorOptions[0].id, doctorName: doctorOptions[0].name, specialty: doctorOptions[0].specialty, image: doctorOptions[0].image, fee: doctorOptions[0].fee, type: "Clinic Visit", date: "Oct 01, 2026", time: "10:30 AM", patientName: "Aarav Mehta", phone: "+91 98765 43210", email: "aarav@example.com" };
  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function pay() {
    setLoading(true);
    setError("");
    try {
      const payment = await paymentService.createCheckout({ amount: draft.fee, method });
      const appointment = await appointmentService.create({ ...draft, paymentReference: payment.reference, paidAmount: payment.amount });
      sessionStorage.setItem("healthcare-connect-confirmation", JSON.stringify(appointment));
      sessionStorage.removeItem(draftKey);
      navigate("/booking/confirmation");
    } catch {
      setError("Payment could not be completed. Please try another method.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="page-container payment-page">
      <PageIntro eyebrow="Secure checkout" title="Complete your booking" description="Review your appointment and choose a payment method." />
      <div className="payment-grid">
        <Card><h2>Appointment summary</h2><div className="review-doctor"><DoctorAvatar doctor={draft} /><div><strong>{draft.doctorName}</strong><p className="muted">{draft.specialty}</p></div></div><div className="review-lines"><div><span>Appointment</span><strong>{draft.type}</strong></div><div><span>Date</span><strong>{draft.date}</strong></div><div><span>Time</span><strong>{draft.time}</strong></div><div><span>Patient</span><strong>{draft.patientName}</strong></div></div><div className="secure-note"><Icon name="shield" /> Your payment is protected.</div></Card>
        <Card className="payment-method-card"><h2>Choose payment method</h2><p className="muted">Select how you’d like to pay for your appointment.</p><div className="payment-methods">{["UPI", "Cards", "Net banking"].map((item) => <button key={item} type="button" className={`payment-method${method === item ? " selected" : ""}`} onClick={() => setMethod(item)}><span className="radio-dot" />{item}</button>)}</div>{error && <div className="alert alert-error" role="alert">{error}</div>}<div className="payment-total"><span>Total payable</span><strong>₹{draft.fee}</strong></div><Button full onClick={pay} disabled={loading}>{loading ? "Processing…" : `Pay ₹${draft.fee}`} <Icon name="arrow" /></Button><p className="gateway-note">Demo checkout only. No real payment will be processed.</p></Card>
      </div>
    </main>
  );
}

export function ConfirmationPage() {
  const [appointment] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("healthcare-connect-confirmation") || "null"); } catch { return null; }
  });
  const details = appointment || { id: "HC-20418", doctorName: "Dr. Priya Sharma", specialty: "Cardiologist", image: doctorOptions[0].image, type: "Clinic Visit", date: "October 01, 2026", time: "10:30 AM", location: "Indiranagar, Bengaluru" };
  return (
    <main className="confirmation-page page-container">
      <Card className="confirmation-card"><span className="confirmation-check"><Icon name="check" /></span><p className="eyebrow">All set</p><h1>Booking confirmed!</h1><p className="muted">Your appointment is booked. We’ll send the details and a reminder to your email.</p><div className="confirmed-doctor"><DoctorAvatar doctor={details} /><div><strong>{details.doctorName}</strong><p className="muted">{details.specialty}</p></div><Badge tone="green">Confirmed</Badge></div><div className="confirmed-details"><div><Icon name="calendar" /><span><small>Date & time</small><strong>{details.date} · {details.time}</strong></span></div><div><Icon name={details.type === "Phone" ? "phone" : "clinic"} /><span><small>Appointment type</small><strong>{details.type}</strong></span></div><div><Icon name="pin" /><span><small>Location</small><strong>{details.location}</strong></span></div></div><Button as={Link} to="/appointments" full>View my appointments <Icon name="arrow" /></Button><Button as={Link} to="/" variant="ghost" full>Back to home</Button><p className="confirmation-reference">Confirmation number <strong>{details.id}</strong></p></Card>
    </main>
  );
}

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState("Upcoming");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    appointmentService.list().then((data) => { if (active) setAppointments(data); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const visible = useMemo(() => appointments.filter((item) => tab === "Upcoming" ? item.status !== "Completed" : item.status === "Completed"), [appointments, tab]);
  return (
    <main className="page-container appointments-page">
      <PageIntro eyebrow="Your care, all in one place" title="My appointments" description="View your upcoming visits and keep track of your care." action={<Button as={Link} to="/search"><Icon name="plus" /> Book an appointment</Button>} />
      <div className="appointment-tabs" role="tablist">{["Upcoming", "Past"].map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}<span>{item === "Upcoming" ? appointments.filter((a) => a.status !== "Completed").length : appointments.filter((a) => a.status === "Completed").length}</span></button>)}</div>
      {loading ? <div className="loading-card"><span className="spinner" /> Loading your appointments…</div> : visible.length ? <div className="appointment-list">{visible.map((item) => <Card className="appointment-card" key={item.id}><div className="appointment-card-main"><DoctorAvatar doctor={{ image: item.image, name: item.doctorName, specialty: item.specialty }} /><div className="appointment-main-copy"><div className="doctor-name-row"><h3>{item.doctorName}</h3><Badge tone="green">{item.status}</Badge></div><p className="muted">{item.specialty}</p><div className="appointment-meta"><span><Icon name="calendar" /> {item.date}</span><span><Icon name="clock" /> {item.time}</span><span><Icon name="clinic" /> {item.type}</span></div></div></div><div className="appointment-card-side"><strong>₹{item.fee}</strong><small>Appointment fee</small><Button as={Link} to={`/doctors/${item.doctorId}`} variant="secondary" size="sm">View details</Button></div></Card>)}</div> : <Card><EmptyState icon="calendar" title={tab === "Upcoming" ? "No upcoming appointments" : "No past appointments yet"} description={tab === "Upcoming" ? "When you book an appointment, you’ll find the details here." : "Your completed visits will appear here."} action={<Button as={Link} to="/search">Find a doctor</Button>} /></Card>}
    </main>
  );
}
