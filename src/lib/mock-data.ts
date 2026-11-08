export interface MockDepartment {
  id: string;
  code: string;
  name: string;
  nameUrdu: string;
  icon: string;
  description: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockDoctor {
  id: string;
  name: string;
  nameUrdu: string;
  qualification: string;
  specialty: string;
  deptCode: string;
  departmentId: string;
  department: {
    id: string;
    code: string;
    name: string;
    nameUrdu?: string;
  };
  fee: number;
  roomNo: string;
  phone: string;
  email: string;
  photoUrl: string;
  bio: string;
  active: boolean;
  schedules?: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes?: number;
    maxPatients?: number;
  }>;
}

export const DEFAULT_HOSPITAL_PROFILE = {
  id: "default",
  name: "Naseem Ijaz Hospital",
  tagline: "Excellence in Compassionate Healthcare",
  city: "Lahore",
  address: "Plot 14-B, Medical Enclave, Jail Road, Lahore, Pakistan",
  phone: "+92 42 3578 9000",
  emergencyPhone: "+92 42 3578 9999",
  email: "info@naseemijazhospital.pk",
  website: "https://naseemijazhospital.pk",
  receiptHeader: "Naseem Ijaz Hospital - Lahore\nOfficial Patient Token & Fee Receipt",
  receiptFooter: "Thank you for visiting. Emergency: +92 42 3578 9999\nValid on date of issue only.",
  prescriptionHeader: "NASEEM IJAZ HOSPITAL\nDepartment of Outpatient Services | Jail Road, Lahore",
  prescriptionFooter: "For queries & appointments: +92 42 3578 9000 | In case of emergency visit ER immediately.",
  tokenResetTime: "00:00",
  maxDiscountApprovalPercent: 20.0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const DEFAULT_DEPARTMENTS: MockDepartment[] = [
  { id: "dept-card", code: "CARD", name: "Cardiology", nameUrdu: "امراض قلب", icon: "HeartPulse", description: "Comprehensive cardiac care, ECG, Echo, and preventive cardiology.", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-orth", code: "ORTH", name: "Orthopedics", nameUrdu: "ہڈیوں اور جوڑوں کے امراض", icon: "Bone", description: "Joint replacement, trauma management, and sports injury care.", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-ped", code: "PED", name: "Pediatrics", nameUrdu: "امراض اطفال", icon: "Baby", description: "Child healthcare, neonatology, and routine immunizations.", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-gyn", code: "GYN", name: "Gynecology & Obstetrics", nameUrdu: "زنانہ و زچگی", icon: "UserCheck", description: "Maternal health, antenatal care, and specialized women health.", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-med", code: "MED", name: "Internal Medicine", nameUrdu: "امراض باطنیہ", icon: "Stethoscope", description: "Diabetes, hypertension, infectious disease, and general medicine.", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-surg", code: "SURG", name: "General Surgery", nameUrdu: "جنرل سرجری", icon: "Activity", description: "Minimally invasive laparoscopic and open surgical interventions.", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-neur", code: "NEUR", name: "Neurology", nameUrdu: "امراض دماغ و اعصاب", icon: "Brain", description: "Disorders of the brain, spinal cord, nerves, and stroke care.", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-opht", code: "OPHT", name: "Ophthalmology", nameUrdu: "امراض چشم", icon: "Eye", description: "Eye exams, cataract surgeries, and vision corrective care.", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-ent", code: "ENT", name: "Ear, Nose & Throat (ENT)", nameUrdu: "کان ناک گلے کے امراض", icon: "Ear", description: "Advanced ENT diagnosis, audiology, and endoscopic sinus care.", active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "dept-derm", code: "DERM", name: "Dermatology", nameUrdu: "امراض جلد و بال", icon: "Sparkles", description: "Skin disease management, cosmetology, and aesthetic therapies.", active: true, createdAt: new Date(), updatedAt: new Date() },
];

export const DEFAULT_DOCTORS: MockDoctor[] = [
  {
    id: "doc-tariq",
    name: "Dr. Tariq Mahmood",
    nameUrdu: "ڈاکٹر طارق محمود",
    qualification: "MBBS, FCPS (Cardiology), FACC (USA)",
    specialty: "Interventional Cardiologist",
    deptCode: "CARD",
    departmentId: "dept-card",
    department: { id: "dept-card", code: "CARD", name: "Cardiology", nameUrdu: "امراض قلب" },
    fee: 2500,
    roomNo: "OPD-101",
    phone: "0300-4567891",
    email: "tariq.cardio@naseemijaz.pk",
    photoUrl: "/images/doctors/dr-tariq-mahmood.webp",
    bio: "Over 18 years of clinical cardiology experience at leading tertiary care hospitals.",
    active: true,
  },
  {
    id: "doc-sana",
    name: "Dr. Sana Farooq",
    nameUrdu: "ڈاکٹر ثناء فاروق",
    qualification: "MBBS, FCPS (Gynecology & Obstetrics)",
    specialty: "Senior Gynecologist & Fertility Specialist",
    deptCode: "GYN",
    departmentId: "dept-gyn",
    department: { id: "dept-gyn", code: "GYN", name: "Gynecology & Obstetrics", nameUrdu: "زنانہ و زچگی" },
    fee: 2200,
    roomNo: "OPD-102",
    phone: "0300-4567892",
    email: "sana.gyn@naseemijaz.pk",
    photoUrl: "/images/doctors/dr-sana-farooq.webp",
    bio: "Expert in high-risk pregnancies, maternal care, and laparoscopic reproductive surgery.",
    active: true,
  },
  {
    id: "doc-ahmed",
    name: "Dr. Ahmed Bilal",
    nameUrdu: "ڈاکٹر احمد بلال",
    qualification: "MBBS, MRCP (UK), FCPS (Medicine)",
    specialty: "Consultant Physician & Diabetologist",
    deptCode: "MED",
    departmentId: "dept-med",
    department: { id: "dept-med", code: "MED", name: "Internal Medicine", nameUrdu: "امراض باطنیہ" },
    fee: 2000,
    roomNo: "OPD-103",
    phone: "0300-4567893",
    email: "ahmed.med@naseemijaz.pk",
    photoUrl: "/images/doctors/dr-ahmed-bilal.webp",
    bio: "Specialist in metabolic syndromes, chronic diabetes management, and geriatric care.",
    active: true,
  },
  {
    id: "doc-usman",
    name: "Dr. Usman Khalid",
    nameUrdu: "ڈاکٹر عثمان خالد",
    qualification: "MBBS, MS (Orthopedics), AO Fellow",
    specialty: "Orthopedic & Spine Surgeon",
    deptCode: "ORTH",
    departmentId: "dept-orth",
    department: { id: "dept-orth", code: "ORTH", name: "Orthopedics", nameUrdu: "ہڈیوں اور جوڑوں کے امراض" },
    fee: 2500,
    roomNo: "OPD-104",
    phone: "0300-4567894",
    email: "usman.ortho@naseemijaz.pk",
    photoUrl: "/images/doctors/dr-usman-khalid.webp",
    bio: "Specializes in joint arthroplasty, complex trauma, and sports ligament reconstruction.",
    active: true,
  },
  {
    id: "doc-fatima",
    name: "Dr. Fatima Noor",
    nameUrdu: "ڈاکٹر فاطمہ نور",
    qualification: "MBBS, FCPS (Pediatrics), DCH (Glasgow)",
    specialty: "Consultant Pediatrician & Neonatologist",
    deptCode: "PED",
    departmentId: "dept-ped",
    department: { id: "dept-ped", code: "PED", name: "Pediatrics", nameUrdu: "امراض اطفال" },
    fee: 1800,
    roomNo: "OPD-105",
    phone: "0300-4567895",
    email: "fatima.ped@naseemijaz.pk",
    photoUrl: "/images/doctors/dr-fatima-noor.webp",
    bio: "Devoted to newborn intensive care, childhood developmental milestones, and nutrition.",
    active: true,
  },
  {
    id: "doc-kamran",
    name: "Dr. Kamran Aslam",
    nameUrdu: "ڈاکٹر کامران اسلم",
    qualification: "MBBS, FRCS (General Surgery, Edin)",
    specialty: "Laparo-Endoscopic General Surgeon",
    deptCode: "SURG",
    departmentId: "dept-surg",
    department: { id: "dept-surg", code: "SURG", name: "General Surgery", nameUrdu: "جنرل سرجری" },
    fee: 2400,
    roomNo: "OPD-106",
    phone: "0300-4567896",
    email: "kamran.surg@naseemijaz.pk",
    photoUrl: "/images/doctors/dr-kamran-aslam.webp",
    bio: "Leading laparoscopic surgeon with deep expertise in minimally invasive gallbladder and hernia procedures.",
    active: true,
  },
  {
    id: "doc-ayesha",
    name: "Dr. Ayesha Malik",
    nameUrdu: "ڈاکٹر عائشہ ملک",
    qualification: "MBBS, FCPS (Neurology)",
    specialty: "Consultant Neurologist",
    deptCode: "NEUR",
    departmentId: "dept-neur",
    department: { id: "dept-neur", code: "NEUR", name: "Neurology", nameUrdu: "امراض دماغ و اعصاب" },
    fee: 2600,
    roomNo: "OPD-107",
    phone: "0300-4567897",
    email: "ayesha.neuro@naseemijaz.pk",
    photoUrl: "/images/doctors/dr-ayesha-malik.webp",
    bio: "Comprehensive management of epilepsy, migraine, neuropathy, stroke recovery, and tremor disorders.",
    active: true,
  },
  {
    id: "doc-zainab",
    name: "Dr. Zainab Shah",
    nameUrdu: "ڈاکٹر زینب شاہ",
    qualification: "MBBS, FCPS (Dermatology)",
    specialty: "Consultant Dermatologist & Aesthetician",
    deptCode: "DERM",
    departmentId: "dept-derm",
    department: { id: "dept-derm", code: "DERM", name: "Dermatology", nameUrdu: "امراض جلد و بال" },
    fee: 2000,
    roomNo: "OPD-108",
    phone: "0300-4567898",
    email: "zainab.derm@naseemijaz.pk",
    photoUrl: "/images/doctors/dr-zainab-shah.webp",
    bio: "Specialist in dermatological pathology, clinical laser treatments, and chronic eczema.",
    active: true,
  },
];

export const DEFAULT_USERS = [
  {
    id: "user-admin",
    name: "System Administrator",
    email: "admin@naseemijaz.pk",
    password: "Admin@123",
    role: "ADMIN",
    doctorId: null,
  },
  {
    id: "user-reception",
    name: "Reception Desk 1",
    email: "reception@naseemijaz.pk",
    password: "Reception@123",
    role: "RECEPTIONIST",
    doctorId: null,
  },
  {
    id: "user-doctor",
    name: "Dr. Tariq Mahmood (Physician Portal)",
    email: "doctor@naseemijaz.pk",
    password: "Doctor@123",
    role: "DOCTOR",
    doctorId: "doc-tariq",
  },
  {
    id: "user-accountant",
    name: "Head Accountant",
    email: "accountant@naseemijaz.pk",
    password: "Accountant@123",
    role: "ACCOUNTANT",
    doctorId: null,
  },
];

export const DEFAULT_PATIENTS = [
  {
    id: "pat-1",
    mrNumber: "NIH-2026-000001",
    fullName: "Muhammad Khan",
    fatherOrHusbandName: "Ali Khan",
    age: 45,
    gender: "MALE",
    cnic: "35201-1001793-2",
    mobile: "03010029134",
    address: "House 13, Street 2, Gulberg III",
    city: "Lahore",
    bloodGroup: "B+",
    allergies: "None reported",
    emergencyContact: "0300-9001234",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "pat-2",
    mrNumber: "NIH-2026-000002",
    fullName: "Fatima Malik",
    fatherOrHusbandName: "Ahmed Malik",
    age: 32,
    gender: "FEMALE",
    cnic: "35201-1003586-3",
    mobile: "03110058268",
    address: "House 14, Street 3, DHA Phase 5",
    city: "Lahore",
    bloodGroup: "O+",
    allergies: "Penicillin",
    emergencyContact: "0300-9002468",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "pat-3",
    mrNumber: "NIH-2026-000003",
    fullName: "Tariq Chaudhry",
    fatherOrHusbandName: "Zainab Chaudhry",
    age: 58,
    gender: "MALE",
    cnic: "35201-1005379-4",
    mobile: "03210087402",
    address: "House 15, Street 4, Model Town",
    city: "Lahore",
    bloodGroup: "A+",
    allergies: "Dust / Pollen",
    emergencyContact: "0300-9003702",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "pat-4",
    mrNumber: "NIH-2026-000004",
    fullName: "Ayesha Bhatti",
    fatherOrHusbandName: "Hamza Bhatti",
    age: 26,
    gender: "FEMALE",
    cnic: "35201-1007172-5",
    mobile: "03310116536",
    address: "House 16, Street 5, Johar Town",
    city: "Lahore",
    bloodGroup: "AB+",
    allergies: "None reported",
    emergencyContact: "0300-9004936",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const DEFAULT_VISITS = [
  {
    id: "vis-1",
    visitNumber: "VIS-2026-000001",
    patientId: "pat-1",
    patient: DEFAULT_PATIENTS[0],
    doctorId: "doc-tariq",
    doctor: DEFAULT_DOCTORS[0],
    departmentId: "dept-card",
    department: DEFAULT_DEPARTMENTS[0],
    tokenNumber: 1,
    tokenDate: new Date().toISOString().split("T")[0],
    visitType: "OPD",
    status: "IN_CONSULTATION",
    priority: "NORMAL",
    consultationFee: 2500,
    discountAmount: 0,
    netAmount: 2500,
    paymentStatus: "PAID",
    createdAt: new Date(),
    prescriptions: [],
  },
  {
    id: "vis-2",
    visitNumber: "VIS-2026-000002",
    patientId: "pat-2",
    patient: DEFAULT_PATIENTS[1],
    doctorId: "doc-sana",
    doctor: DEFAULT_DOCTORS[1],
    departmentId: "dept-gyn",
    department: DEFAULT_DEPARTMENTS[3],
    tokenNumber: 1,
    tokenDate: new Date().toISOString().split("T")[0],
    visitType: "OPD",
    status: "WAITING",
    priority: "EMERGENCY",
    consultationFee: 2200,
    discountAmount: 0,
    netAmount: 2200,
    paymentStatus: "PAID",
    createdAt: new Date(),
    prescriptions: [],
  },
  {
    id: "vis-3",
    visitNumber: "VIS-2026-000003",
    patientId: "pat-3",
    patient: DEFAULT_PATIENTS[2],
    doctorId: "doc-ahmed",
    doctor: DEFAULT_DOCTORS[2],
    departmentId: "dept-med",
    department: DEFAULT_DEPARTMENTS[4],
    tokenNumber: 2,
    tokenDate: new Date().toISOString().split("T")[0],
    visitType: "OPD",
    status: "WAITING",
    priority: "NORMAL",
    consultationFee: 2000,
    discountAmount: 0,
    netAmount: 2000,
    paymentStatus: "PAID",
    createdAt: new Date(),
    prescriptions: [],
  },
];

export const DEFAULT_BILLS = [
  {
    id: "bill-1",
    billNumber: "INV-2026-000001",
    visitId: "vis-1",
    patientId: "pat-1",
    patient: DEFAULT_PATIENTS[0],
    grossAmount: 2500,
    discountAmount: 0,
    netAmount: 2500,
    paidAmount: 2500,
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    createdAt: new Date(),
    refunds: [],
  },
  {
    id: "bill-2",
    billNumber: "INV-2026-000002",
    visitId: "vis-2",
    patientId: "pat-2",
    patient: DEFAULT_PATIENTS[1],
    grossAmount: 2200,
    discountAmount: 0,
    netAmount: 2200,
    paidAmount: 2200,
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    createdAt: new Date(),
    refunds: [],
  },
];

export const DEFAULT_APPOINTMENTS = [
  {
    id: "apt-1",
    bookingReference: "APT-2026-0001",
    patientName: "Muhammad Khan",
    patientPhone: "03010029134",
    doctorId: "doc-tariq",
    doctor: DEFAULT_DOCTORS[0],
    departmentId: "dept-card",
    department: DEFAULT_DEPARTMENTS[0],
    appointmentDate: new Date().toISOString().split("T")[0],
    timeSlot: "10:00",
    status: "CONFIRMED",
    createdAt: new Date(),
  },
];

export const DEFAULT_MEDICINES = [
  { id: "med-1", name: "Panadol 500mg", genericName: "Paracetamol", category: "Analgesic", dosageForm: "Tablet", commonDosage: "1 tab TDS for 3 days" },
  { id: "med-2", name: "Augmentin 625mg", genericName: "Co-Amoxiclav", category: "Antibiotic", dosageForm: "Tablet", commonDosage: "1 tab BD for 5 days" },
  { id: "med-3", name: "Risek 40mg", genericName: "Omeprazole", category: "Antacid / PPI", dosageForm: "Capsule", commonDosage: "1 cap OD before breakfast" },
  { id: "med-4", name: "Glucophage 500mg", genericName: "Metformin HCl", category: "Antidiabetic", dosageForm: "Tablet", commonDosage: "1 tab BD with meals" },
  { id: "med-5", name: "Brufen 400mg", genericName: "Ibuprofen", category: "NSAID", dosageForm: "Tablet", commonDosage: "1 tab TDS after food" },
];

