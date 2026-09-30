import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card, DoctorAvatar, Field, Icon, PageIntro, SectionHeading } from "../../components/common/UI";
import { doctorOptions, verificationService } from "../../services/mockApi";

const onboardingSteps = ["Personal details", "Professional details", "Registration", "Documents"];
const weekdayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const initialDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function DoctorOnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [fileNames, setFileNames] = useState({});
  const [submitted, setSubmitted] = useState(false);
  function advance(event) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    if (step === 0 && (!form.get("full-name") || !form.get("phone"))) {
      setError("Add your full name and phone number to continue.");
      return;
    }
    if (step === 1 && (!form.get("specialty") || !form.get("qualification"))) {
      setError("Add your specialty and qualification to continue.");
      return;
    }
    if (step === 2 && (!form.get("registration-number") || !form.get("registration-council"))) {
      setError("Add your medical registration details to continue.");
      return;
    }
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
      return;
    }
    setSubmitted(true);
  }
  if (submitted) return <main className="page-container"><Card className="onboarding-success"><span className="success-orb"><Icon name="check" /></span><p className="eyebrow">Application received</p><h1>Thanks for sharing your details.</h1><p className="muted">Your registration information is ready for review. We’ll keep you posted on the verification status.</p><Button onClick={() => navigate("/doctor/verification")}>View verification status <Icon name="arrow" /></Button></Card></main>;
  return (
    <main className="page-container onboarding-page">
      <div className="breadcrumb"><Link to="/">HealthCare Connect</Link><span>›</span><span>Doctor onboarding</span></div>
      <PageIntro eyebrow="Welcome to our doctor community" title="Let’s set up your profile" description="Share a few details so patients can find and book with you." />
      <div className="onboarding-layout">
        <Card className="onboarding-main-card">
          <div className="onboarding-step-label"><span>STEP {step + 1} OF {onboardingSteps.length}</span><strong>{onboardingSteps[step]}</strong></div>
          <div className="onboarding-progress">{onboardingSteps.map((item, index) => <div key={item} className={index <= step ? "progress-active" : ""} />)}</div>
          <form className="form-stack onboarding-form" onSubmit={advance}>
            {step === 0 && <><h2>Tell us about yourself</h2><p className="muted">Use the name and details that match your medical registration.</p><Field label="Full name" name="full-name" placeholder="Dr. Priya Sharma" required /><Field label="Email address" name="email" type="email" placeholder="you@example.com" defaultValue="priya.sharma@example.com" required /><Field label="Phone number" name="phone" type="tel" placeholder="+91 98765 43210" required /><Field label="Clinic / practice name (optional)" name="clinic" placeholder="Your clinic name" /></>}
            {step === 1 && <><h2>Your professional details</h2><p className="muted">Help patients understand your experience and areas of care.</p><Field label="Specialty" name="specialty" as="select" defaultValue=""><option value="" disabled>Select your specialty</option><option>Cardiologist</option><option>Dermatologist</option><option>Pediatrician</option><option>General physician</option><option>Other</option></Field><Field label="Qualifications" name="qualification" placeholder="MBBS, MD" required /><Field label="Years of experience" name="experience" type="number" min="0" placeholder="e.g. 8" required /><Field label="Practice address" name="address" placeholder="Street, area, city" required /></>}
            {step === 2 && <><h2>Medical registration details</h2><p className="muted">We use these details to request verification from the relevant registration service.</p><Field label="Registration number" name="registration-number" placeholder="Enter your medical registration ID" required /><Field label="Registration council" name="registration-council" as="select" defaultValue=""><option value="" disabled>Select your council</option><option>Karnataka Medical Council</option><option>Delhi Medical Council</option><option>Maharashtra Medical Council</option><option>Other / not listed</option></Field><div className="alert alert-info"><Icon name="shield" /> Verification depends on the availability and requirements of the selected registration service.</div></>}
            {step === 3 && <><h2>Upload your documents</h2><p className="muted">Add clear copies of the documents needed to review your application.</p>{[["registration-proof", "Medical registration certificate"], ["identity-proof", "Government identity document"], ["profile-photo", "Professional profile photo"]].map(([name, label]) => <label className="upload-box" key={name}><input type="file" name={name} accept={name === "profile-photo" ? "image/*" : ".pdf,.jpg,.jpeg,.png"} onChange={(event) => setFileNames({ ...fileNames, [name]: event.target.files?.[0]?.name || "" })} /><span className="upload-icon"><Icon name="upload" /></span><span><strong>{label}</strong><small>{fileNames[name] || "PDF, JPG, or PNG · select a file to attach"}</small></span><Button type="button" variant="secondary" size="sm">Browse</Button></label>)}<p className="field-hint">You can continue in this preview without attaching files. Final document requirements may vary.</p></>}
            {error && <div className="alert alert-error" role="alert">{error}</div>}
            <div className="onboarding-actions">{step > 0 && <Button type="button" variant="secondary" onClick={() => { setError(""); setStep(step - 1); }}>Back</Button>}<Button type="submit">{step === onboardingSteps.length - 1 ? "Submit for review" : "Save & continue"} <Icon name="arrow" /></Button></div>
          </form>
        </Card>
        <aside className="onboarding-aside"><Card><span className="onboarding-aside-icon"><Icon name="shield" /></span><h3>Your information is protected</h3><p>We use your registration details to support verification and help patients discover qualified doctors.</p><ul><li><Icon name="check" /> Secure profile setup</li><li><Icon name="check" /> Medical registration review</li><li><Icon name="check" /> Status updates by email</li></ul></Card><p className="muted onboarding-help">Need help? <Link to="/about">Contact our team</Link></p></aside>
      </div>
    </main>
  );
}

export function VerificationPage() {
  const [status, setStatus] = useState(() => verificationService.getStatus());
  const [retrying, setRetrying] = useState(false);
  async function refresh() {
    setRetrying(true);
    try { setStatus(await verificationService.getStatus()); } finally { setRetrying(false); }
  }
  const stages = [
    ["Account created", "Your account is set up and ready.", "done"],
    ["Details submitted", "We’ve received your professional information.", "done"],
    ["Registration review", status.note, "current"],
    ["Profile approval", "Your profile can be activated after review.", "upcoming"],
  ];
  return (
    <div className="doctor-screen">
      <PageIntro eyebrow="Doctor onboarding" title="Verification status" description="We’ll keep you updated as your profile moves through review." />
      <div className="verification-layout">
        <Card className="verification-card"><div className="verification-title"><span className="status-pulse"><Icon name="clock" /></span><div><Badge tone="amber">In review</Badge><h2>Your details are being reviewed</h2><p className="muted">Last updated {status.updated}</p></div></div><div className="verification-timeline">{stages.map(([title, copy, stage], index) => <div className={`timeline-item ${stage}`} key={title}><span className="timeline-marker">{stage === "done" ? <Icon name="check" /> : index + 1}</span><div><strong>{title}</strong><p className="muted">{copy}</p></div></div>)}</div><Button variant="secondary" onClick={refresh} disabled={retrying}>{retrying ? "Refreshing…" : "Refresh status"}</Button></Card>
        <Card className="verification-help-card"><span className="onboarding-aside-icon"><Icon name="shield" /></span><h3>What happens next?</h3><p>Your professional registration details will be reviewed. Timing depends on the selected verification service and its availability.</p><p className="muted">We’ll send an email when your status changes.</p><Link to="/about">Questions? Contact our team →</Link></Card>
      </div>
      <Card className="verification-next"><div><h3>Get ready for your profile</h3><p className="muted">You can review the joining information while your registration is under review.</p></div><Button as={Link} to="/doctor/joining-fee" variant="secondary">View joining information <Icon name="arrow" /></Button></Card>
    </div>
  );
}

export function JoiningFeePage() {
  return (
    <div className="doctor-screen">
      <PageIntro eyebrow="Account setup" title="Doctor joining information" description="A quick overview of the next step for your HealthCare Connect profile." />
      <Card className="joining-card"><span className="joining-icon"><Icon name="wallet" /></span><p className="eyebrow">PROFILE ACTIVATION</p><h2>Payment details will be shared after review.</h2><p className="muted">The platform proposal does not specify a doctor joining-fee amount. Any applicable fee and payment instructions will be confirmed before a payment is requested.</p><div className="joining-detail"><span>Verification status</span><Badge tone="amber">In review</Badge></div><div className="joining-detail"><span>Payment provider</span><strong>Razorpay setup pending</strong></div><div className="alert alert-info"><Icon name="shield" /> No payment is collected in this preview.</div><div className="joining-actions"><Button as={Link} to="/doctor/verification" variant="secondary">Back to status</Button><Button as={Link} to="/doctor/dashboard">Continue to dashboard <Icon name="arrow" /></Button></div></Card>
    </div>
  );
}

export function DoctorDashboardPage() {
  const upcoming = [
    { name: "Aarav Mehta", type: "Clinic Visit", time: "10:30 AM", date: "Today", image: doctorOptions[0].image },
    { name: "Meera Kapoor", type: "Phone", time: "12:00 PM", date: "Today", image: doctorOptions[0].image },
    { name: "Rohan Iyer", type: "Clinic Visit", time: "02:30 PM", date: "Tomorrow", image: doctorOptions[0].image },
  ];
  return (
    <div className="doctor-screen">
      <PageIntro eyebrow="Your practice at a glance" title="Dashboard" description="Welcome back, Dr. Sharma. Here’s what’s happening with your practice." action={<Button as={Link} to="/doctor/profile/edit" variant="secondary"><Icon name="settings" /> Edit profile</Button>} />
      <div className="doctor-stat-grid"><Card className="doctor-stat"><span className="stat-icon"><Icon name="calendar" /></span><p>Appointments this week</p><strong>18</strong><small className="stat-up">↑ 3 from last week</small></Card><Card className="doctor-stat"><span className="stat-icon"><Icon name="people" /></span><p>Upcoming appointments</p><strong>6</strong><small>Next visit at 10:30 AM</small></Card><Card className="doctor-stat"><span className="stat-icon"><Icon name="star" /></span><p>Profile rating</p><strong>4.9 <small>/ 5</small></strong><small>Based on 128 reviews</small></Card></div>
      <div className="dashboard-grid"><Card className="dashboard-appointments"><SectionHeading title="Upcoming appointments" action={<Button as={Link} to="/doctor/availability" variant="ghost" size="sm">Manage availability <Icon name="arrow" /></Button>} />{upcoming.map((appointment) => <div className="dashboard-appointment" key={appointment.name}><span className="patient-avatar">{appointment.name.split(" ").map((part) => part[0]).join("")}</span><div className="dashboard-patient"><strong>{appointment.name}</strong><small>{appointment.type} · {appointment.date}</small></div><span className="dashboard-time"><Icon name="clock" /> {appointment.time}</span><Button variant="ghost" size="sm">View</Button></div>)}</Card>
        <Card className="profile-completion"><span className="completion-icon"><Icon name="check" /></span><p className="eyebrow">YOUR PROFILE</p><h3>Looking good, Doctor</h3><p className="muted">Your profile is ready for patients to discover.</p><div className="completion-meter"><span /></div><div className="completion-percent"><span>Profile completeness</span><strong>85%</strong></div><Button as={Link} to="/doctor/profile/edit" variant="secondary" full>Complete your profile</Button><div className="verification-mini"><Icon name="shield" /><span><strong>Verification in review</strong><small>We’ll email you when there’s an update.</small></span></div></Card>
      </div>
    </div>
  );
}

export function AvailabilityPage() {
  const [selectedDays, setSelectedDays] = useState(initialDays);
  const [selectedDate, setSelectedDate] = useState(7);
  const [slots, setSlots] = useState(["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM"]);
  const [saved, setSaved] = useState(false);
  const cells = [...Array(3).fill(null), ...Array.from({ length: 31 }, (_, index) => index + 1)];
  function toggleDay(day) {
    setSaved(false);
    setSelectedDays(selectedDays.includes(day) ? selectedDays.filter((item) => item !== day) : [...selectedDays, day]);
  }
  return (
    <div className="doctor-screen">
      <PageIntro eyebrow="Make time for care" title="Manage availability" description="Choose the days and times patients can book with you." />
      <div className="availability-grid">
        <Card className="availability-calendar-card"><div className="calendar-heading"><div><p className="eyebrow">YOUR SCHEDULE</p><h2>October 2026</h2></div><div className="calendar-arrows"><Button variant="secondary" size="sm" aria-label="Previous month">‹</Button><Button variant="secondary" size="sm" aria-label="Next month">›</Button></div></div><div className="calendar-grid calendar-weekdays">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{cells.map((date, index) => date ? <button type="button" key={date} className={`calendar-day${date === selectedDate ? " selected" : ""}${[2, 3, 6, 7, 9, 12, 13, 16, 19, 21, 23, 27, 30].includes(date) ? " has-slots" : ""}`} onClick={() => setSelectedDate(date)}>{date}</button> : <span key={`blank-${index}`} />)}</div><div className="calendar-legend"><span><i className="legend-available" /> Available</span><span><i className="legend-selected" /> Selected day</span></div></Card>
        <Card className="day-settings-card"><p className="eyebrow">WEEKLY SCHEDULE</p><h2>Working days</h2><p className="muted">Select the days you’re available for appointments.</p><div className="weekday-list">{weekdayNames.map((day) => <label className="weekday-toggle" key={day}><span>{day}</span><input type="checkbox" checked={selectedDays.includes(day)} onChange={() => toggleDay(day)} /><i /></label>)}</div><h3>Time slots · October {selectedDate}</h3><div className="time-grid compact">{slots.map((time) => <button type="button" key={time} className="time-option selected" onClick={() => { setSlots(slots.filter((slot) => slot !== time)); setSaved(false); }}>{time}<span>×</span></button>)}</div><button className="add-slot-button" type="button" onClick={() => { const next = appointmentTimesFallback.find((time) => !slots.includes(time)); if (next) { setSlots([...slots, next]); setSaved(false); } }}><Icon name="plus" /> Add time slot</button><Button full onClick={() => setSaved(true)}>{saved ? <><Icon name="check" /> Schedule saved</> : "Save availability"}</Button>{saved && <p className="save-confirmation" role="status">Your availability has been saved for this preview.</p>}</Card>
      </div>
    </div>
  );
}

const appointmentTimesFallback = ["08:00 AM", "09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM", "06:00 PM"];

export function DoctorProfileEditPage() {
  const doctor = doctorOptions[0];
  const [saved, setSaved] = useState(false);
  return (
    <div className="doctor-screen">
      <PageIntro eyebrow="Your professional presence" title="Edit profile" description="Keep your profile details current so patients know what to expect." action={<Button as={Link} to={`/doctors/${doctor.id}`} variant="secondary">Preview public profile <Icon name="arrow" /></Button>} />
      <div className="edit-profile-grid"><Card className="edit-profile-form"><div className="edit-profile-photo"><DoctorAvatar doctor={doctor} size="lg" /><Button type="button" variant="secondary" size="sm">Change photo</Button><small>JPG or PNG · up to 5 MB</small></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}><h2>Professional details</h2><div className="form-columns"><Field label="Full name" name="doctor-name" defaultValue={doctor.name} required /><Field label="Specialty" name="doctor-specialty" as="select" defaultValue={doctor.specialty}><option>Cardiologist</option><option>Dermatologist</option><option>Pediatrician</option><option>General physician</option></Field></div><div className="form-columns"><Field label="Qualifications" name="doctor-qualifications" defaultValue={doctor.qualifications} required /><Field label="Years of experience" name="doctor-experience" type="number" defaultValue={doctor.experience} min="0" required /></div><Field label="About you" name="doctor-about" as="textarea" rows="4" defaultValue={doctor.bio} required /><Field label="Practice address" name="doctor-location" defaultValue={doctor.location} required /><div className="form-columns"><Field label="Consultation fee (₹)" name="doctor-fee" type="number" defaultValue={doctor.fee} min="0" required /><Field label="Languages" name="doctor-languages" defaultValue={doctor.languages.join(", ")} /></div><div className="edit-service-options"><span className="field-label">Appointment types offered</span>{["Phone", "Clinic Visit", "Home Visit"].map((item) => <label className="check-label" key={item}><input type="checkbox" defaultChecked={doctor.services.includes(item)} /> {item}</label>)}</div>{saved && <div className="alert alert-success" role="status"><Icon name="check" /> Your profile changes have been saved in this preview.</div>}<div className="edit-actions"><Button type="button" variant="secondary" onClick={() => setSaved(false)}>Cancel</Button><Button type="submit">Save changes <Icon name="arrow" /></Button></div></form></Card><Card className="profile-side-info"><span className="onboarding-aside-icon"><Icon name="shield" /></span><h3>Profile visibility</h3><Badge tone="green">Visible to patients</Badge><p className="muted">Your public profile helps patients learn about your practice and choose an appointment type.</p><div className="profile-visibility-line"><span>Registration verification</span><Badge tone="amber">In review</Badge></div><Button as={Link} to="/doctor/verification" variant="secondary" full>View verification status</Button></Card></div>
    </div>
  );
}
