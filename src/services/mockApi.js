const doctors = [
  {
    id: "priya-sharma",
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    qualifications: "MBBS, MD (Cardiology)",
    experience: 12,
    rating: "4.9",
    reviews: 128,
    location: "Indiranagar, Bengaluru",
    distance: "1.8 km away",
    fee: 600,
    services: ["Clinic Visit", "Phone"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=480&q=85",
    bio: "Dr. Priya Sharma is a compassionate cardiologist with over 12 years of experience helping people build healthier hearts. She believes great care starts with listening and making every patient feel at ease.",
    languages: ["English", "Hindi", "Kannada"],
    nextAvailable: "Today, 4:30 PM",
  },
  {
    id: "rahul-mehta",
    name: "Dr. Rahul Mehta",
    specialty: "Dermatologist",
    qualifications: "MBBS, MD (Dermatology)",
    experience: 9,
    rating: "4.8",
    reviews: 96,
    location: "Koramangala, Bengaluru",
    distance: "3.2 km away",
    fee: 500,
    services: ["Clinic Visit", "Phone", "Home Visit"],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=480&q=85",
    bio: "Dr. Rahul Mehta provides thoughtful, evidence-based dermatology care for people of all ages. His practice focuses on clear communication and practical treatment plans.",
    languages: ["English", "Hindi"],
    nextAvailable: "Tomorrow, 10:00 AM",
  },
  {
    id: "ananya-rao",
    name: "Dr. Ananya Rao",
    specialty: "Pediatrician",
    qualifications: "MBBS, DCH, DNB",
    experience: 15,
    rating: "5.0",
    reviews: 204,
    location: "Whitefield, Bengaluru",
    distance: "5.4 km away",
    fee: 700,
    services: ["Clinic Visit", "Home Visit"],
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=480&q=85",
    bio: "Dr. Ananya Rao has spent 15 years caring for children and supporting families. She creates a warm, reassuring environment for routine visits and ongoing care.",
    languages: ["English", "Kannada", "Tamil"],
    nextAvailable: "Today, 6:00 PM",
  },
];

const sampleAppointments = [
  {
    id: "HC-20418",
    doctorId: "priya-sharma",
    doctorName: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    image: doctors[0].image,
    type: "Clinic Visit",
    date: "October 04, 2026",
    time: "10:30 AM",
    status: "Confirmed",
    fee: 600,
    location: doctors[0].location,
  },
  {
    id: "HC-20397",
    doctorId: "rahul-mehta",
    doctorName: "Dr. Rahul Mehta",
    specialty: "Dermatologist",
    image: doctors[1].image,
    type: "Phone",
    date: "October 07, 2026",
    time: "2:00 PM",
    status: "Confirmed",
    fee: 500,
    location: "Phone consultation",
  },
];

export const authService = {
  async signIn({ email, role = "patient" }) {
    await Promise.resolve();
    return { name: role === "doctor" ? "Dr. Priya Sharma" : email.split("@")[0].replace(/[._-]/g, " "), email, role };
  },
  async signUp({ name, email, role }) {
    await Promise.resolve();
    return { name, email, role };
  },
  async verifyOtp(code) {
    await Promise.resolve();
    if (code.length !== 6) throw new Error("Enter the 6-digit verification code.");
    return { verified: true };
  },
};

export const doctorService = {
  async list({ query = "", specialty = "All specialties" } = {}) {
    await Promise.resolve();
    return doctors.filter((doctor) => {
      const matchesQuery = `${doctor.name} ${doctor.specialty} ${doctor.location}`.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && (specialty === "All specialties" || doctor.specialty === specialty);
    });
  },
  async getById(id) {
    await Promise.resolve();
    return doctors.find((doctor) => doctor.id === id) || null;
  },
};

export const appointmentService = {
  async create(booking) {
    await Promise.resolve();
    const appointment = { ...booking, id: `HC-${Date.now().toString().slice(-6)}`, status: "Confirmed" };
    const saved = JSON.parse(localStorage.getItem("healthcare-connect-appointments") || "[]");
    localStorage.setItem("healthcare-connect-appointments", JSON.stringify([appointment, ...saved]));
    return appointment;
  },
  async list() {
    await Promise.resolve();
    const saved = JSON.parse(localStorage.getItem("healthcare-connect-appointments") || "[]");
    return [...saved, ...sampleAppointments];
  },
};

export const paymentService = {
  async createCheckout({ amount, method }) {
    await Promise.resolve();
    return { status: "completed", amount, method, reference: `PAY-${Date.now().toString().slice(-8)}` };
  },
};

export const verificationService = {
  async getStatus() {
    await Promise.resolve();
    return { status: "in_review", updated: "September 29, 2026", note: "Your registration details are being reviewed." };
  },
};

export const doctorOptions = doctors;
