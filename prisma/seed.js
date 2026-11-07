const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seed for Naseem Ijaz Hospital ---');

  // 1. Hospital Profile
  console.log('Seeding Hospital Profile...');
  await prisma.hospitalProfile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Naseem Ijaz Hospital',
      tagline: 'Excellence in Compassionate Healthcare',
      city: 'Lahore',
      address: 'Plot 14-B, Medical Enclave, Jail Road, Lahore, Pakistan',
      phone: '+92 42 3578 9000',
      emergencyPhone: '+92 42 3578 9999',
      email: 'info@naseemijazhospital.pk',
      website: 'https://naseemijazhospital.pk',
      receiptHeader: 'Naseem Ijaz Hospital - Lahore\nOfficial Patient Token & Fee Receipt',
      receiptFooter: 'Thank you for visiting. Emergency: +92 42 3578 9999\nValid on date of issue only.',
      prescriptionHeader: 'NASEEM IJAZ HOSPITAL\nDepartment of Outpatient Services | Jail Road, Lahore',
      prescriptionFooter: 'For queries & appointments: +92 42 3578 9000 | In case of emergency visit ER immediately.',
      tokenResetTime: '00:00',
      maxDiscountApprovalPercent: 20.0,
    },
  });

  // 2. Departments (10 Departments)
  console.log('Seeding 10 Departments...');
  const departmentsData = [
    { code: 'CARD', name: 'Cardiology', nameUrdu: 'امراض قلب', icon: 'HeartPulse', description: 'Comprehensive cardiac care, ECG, Echo, and preventive cardiology.' },
    { code: 'ORTH', name: 'Orthopedics', nameUrdu: 'ہڈیوں اور جوڑوں کے امراض', icon: 'Bone', description: 'Joint replacement, trauma management, and sports injury care.' },
    { code: 'PED',  name: 'Pediatrics', nameUrdu: 'امراض اطفال', icon: 'Baby', description: 'Child healthcare, neonatology, and routine immunizations.' },
    { code: 'GYN',  name: 'Gynecology & Obstetrics', nameUrdu: 'زنانہ و زچگی', icon: 'UserCheck', description: 'Maternal health, antenatal care, and specialized women health.' },
    { code: 'MED',  name: 'Internal Medicine', nameUrdu: 'امراض باطنیہ', icon: 'Stethoscope', description: 'Diabetes, hypertension, infectious disease, and general medicine.' },
    { code: 'SURG', name: 'General Surgery', nameUrdu: 'جنرل سرجری', icon: 'Activity', description: 'Minimally invasive laparoscopic and open surgical interventions.' },
    { code: 'NEUR', name: 'Neurology', nameUrdu: 'امراض دماغ و اعصاب', icon: 'Brain', description: 'Disorders of the brain, spinal cord, nerves, and stroke care.' },
    { code: 'OPHT', name: 'Ophthalmology', nameUrdu: 'امراض چشم', icon: 'Eye', description: 'Eye exams, cataract surgeries, and vision corrective care.' },
    { code: 'ENT',  name: 'Ear, Nose & Throat (ENT)', nameUrdu: 'کان ناک گلے کے امراض', icon: 'Ear', description: 'Advanced ENT diagnosis, audiology, and endoscopic sinus care.' },
    { code: 'DERM', name: 'Dermatology', nameUrdu: 'امراض جلد و بال', icon: 'Sparkles', description: 'Skin disease management, cosmetology, and aesthetic therapies.' },
  ];

  const depts = {};
  for (const d of departmentsData) {
    const dept = await prisma.department.upsert({
      where: { code: d.code },
      update: { name: d.name, nameUrdu: d.nameUrdu, description: d.description, icon: d.icon },
      create: d,
    });
    depts[d.code] = dept;
  }

  // 3. Doctors (8 Doctors)
  console.log('Seeding 8 Doctors...');
  const doctorsData = [
    {
      name: 'Dr. Tariq Mahmood',
      nameUrdu: 'ڈاکٹر طارق محمود',
      qualification: 'MBBS, FCPS (Cardiology), FACC (USA)',
      specialty: 'Interventional Cardiologist',
      deptCode: 'CARD',
      fee: 2500,
      roomNo: 'OPD-101',
      phone: '0300-4567891',
      email: 'tariq.cardio@naseemijaz.pk',
      bio: 'Over 18 years of clinical cardiology experience at leading tertiary care hospitals.',
    },
    {
      name: 'Dr. Sana Farooq',
      nameUrdu: 'ڈاکٹر ثناء فاروق',
      qualification: 'MBBS, FCPS (Gynecology & Obstetrics)',
      specialty: 'Senior Gynecologist & Fertility Specialist',
      deptCode: 'GYN',
      fee: 2200,
      roomNo: 'OPD-102',
      phone: '0300-4567892',
      email: 'sana.gyn@naseemijaz.pk',
      bio: 'Expert in high-risk pregnancies, maternal care, and laparoscopic reproductive surgery.',
    },
    {
      name: 'Dr. Ahmed Bilal',
      nameUrdu: 'ڈاکٹر احمد بلال',
      qualification: 'MBBS, MRCP (UK), FCPS (Medicine)',
      specialty: 'Consultant Physician & Diabetologist',
      deptCode: 'MED',
      fee: 2000,
      roomNo: 'OPD-103',
      phone: '0300-4567893',
      email: 'ahmed.med@naseemijaz.pk',
      bio: 'Specialist in metabolic syndromes, chronic diabetes management, and geriatric care.',
    },
    {
      name: 'Dr. Usman Khalid',
      nameUrdu: 'ڈاکٹر عثمان خالد',
      qualification: 'MBBS, MS (Orthopedics), AO Fellow',
      specialty: 'Orthopedic & Spine Surgeon',
      deptCode: 'ORTH',
      fee: 2500,
      roomNo: 'OPD-104',
      phone: '0300-4567894',
      email: 'usman.ortho@naseemijaz.pk',
      bio: 'Specializes in joint arthroplasty, complex trauma, and sports ligament reconstruction.',
    },
    {
      name: 'Dr. Fatima Noor',
      nameUrdu: 'ڈاکٹر فاطمہ نور',
      qualification: 'MBBS, FCPS (Pediatrics), DCH (Glasgow)',
      specialty: 'Consultant Pediatrician & Neonatologist',
      deptCode: 'PED',
      fee: 1800,
      roomNo: 'OPD-105',
      phone: '0300-4567895',
      email: 'fatima.ped@naseemijaz.pk',
      bio: 'Devoted to newborn intensive care, childhood developmental milestones, and nutrition.',
    },
    {
      name: 'Dr. Kamran Aslam',
      nameUrdu: 'ڈاکٹر کامران اسلم',
      qualification: 'MBBS, FRCS (General Surgery, Edin)',
      specialty: 'Laparo-Endoscopic General Surgeon',
      deptCode: 'SURG',
      fee: 2400,
      roomNo: 'OPD-106',
      phone: '0300-4567896',
      email: 'kamran.surg@naseemijaz.pk',
      bio: 'Leading laparoscopic surgeon with deep expertise in minimally invasive gallbladder and hernia procedures.',
    },
    {
      name: 'Dr. Ayesha Malik',
      nameUrdu: 'ڈاکٹر عائشہ ملک',
      qualification: 'MBBS, FCPS (Neurology)',
      specialty: 'Consultant Neurologist',
      deptCode: 'NEUR',
      fee: 2600,
      roomNo: 'OPD-107',
      phone: '0300-4567897',
      email: 'ayesha.neuro@naseemijaz.pk',
      bio: 'Comprehensive management of epilepsy, migraine, neuropathy, stroke recovery, and tremor disorders.',
    },
    {
      name: 'Dr. Zubair Shah',
      nameUrdu: 'ڈاکٹر زبیر شاہ',
      qualification: 'MBBS, FCPS (Dermatology)',
      specialty: 'Consultant Dermatologist & Aesthetician',
      deptCode: 'DERM',
      fee: 2000,
      roomNo: 'OPD-108',
      phone: '0300-4567898',
      email: 'zubair.derm@naseemijaz.pk',
      bio: 'Specialist in dermatological pathology, clinical laser treatments, and chronic eczema.',
    },
  ];

  const seededDoctors = [];
  for (const doc of doctorsData) {
    const existing = await prisma.doctor.findFirst({ where: { email: doc.email } });
    const savedDoc = existing
      ? await prisma.doctor.update({
          where: { id: existing.id },
          data: {
            name: doc.name,
            nameUrdu: doc.nameUrdu,
            qualification: doc.qualification,
            specialty: doc.specialty,
            fee: doc.fee,
            roomNo: doc.roomNo,
            phone: doc.phone,
            bio: doc.bio,
            departmentId: depts[doc.deptCode].id,
          },
        })
      : await prisma.doctor.create({
          data: {
            name: doc.name,
            nameUrdu: doc.nameUrdu,
            qualification: doc.qualification,
            specialty: doc.specialty,
            fee: doc.fee,
            roomNo: doc.roomNo,
            phone: doc.phone,
            email: doc.email,
            bio: doc.bio,
            departmentId: depts[doc.deptCode].id,
          },
        });
    seededDoctors.push(savedDoc);

    // Seed schedule (Mon - Sat, 09:00 to 14:00 or 15:00 to 20:00)
    for (let day = 1; day <= 6; day++) {
      const existingSched = await prisma.doctorSchedule.findFirst({
        where: { doctorId: savedDoc.id, dayOfWeek: day },
      });
      if (!existingSched) {
        await prisma.doctorSchedule.create({
          data: {
            doctorId: savedDoc.id,
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '15:00',
            slotDurationMinutes: 15,
            maxPatients: 25,
          },
        });
      }
    }
  }

  // 4. Seed Users (1 per role)
  console.log('Seeding System Users (Admin, Receptionist, Doctor, Accountant)...');
  const salt = await bcrypt.genSalt(10);
  const usersToSeed = [
    {
      name: 'System Administrator',
      email: 'admin@naseemijaz.pk',
      password: 'Admin@123',
      role: 'ADMIN',
    },
    {
      name: 'Reception Desk 1',
      email: 'reception@naseemijaz.pk',
      password: 'Reception@123',
      role: 'RECEPTIONIST',
    },
    {
      name: 'Dr. Tariq Mahmood (Physician Portal)',
      email: 'doctor@naseemijaz.pk',
      password: 'Doctor@123',
      role: 'DOCTOR',
      doctorId: seededDoctors[0].id,
    },
    {
      name: 'Head Accountant',
      email: 'accountant@naseemijaz.pk',
      password: 'Accountant@123',
      role: 'ACCOUNTANT',
    },
  ];

  for (const u of usersToSeed) {
    const passwordHash = await bcrypt.hash(u.password, salt);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, passwordHash, role: u.role, doctorId: u.doctorId || null },
      create: { name: u.name, email: u.email, passwordHash, role: u.role, doctorId: u.doctorId || null },
    });
  }

  // 5. Seed Common Medicine Catalog
  console.log('Seeding Medicine Catalog...');
  const medicines = [
    { name: 'Panadol 500mg', genericName: 'Paracetamol', category: 'Analgesic', dosageForm: 'Tablet', commonDosage: '1 tab TDS for 3 days' },
    { name: 'Augmentin 625mg', genericName: 'Co-Amoxiclav', category: 'Antibiotic', dosageForm: 'Tablet', commonDosage: '1 tab BD for 5 days' },
    { name: 'Risek 40mg', genericName: 'Omeprazole', category: 'Antacid / PPI', dosageForm: 'Capsule', commonDosage: '1 cap OD before breakfast' },
    { name: 'Cravit 500mg', genericName: 'Levofloxacin', category: 'Antibiotic', dosageForm: 'Tablet', commonDosage: '1 tab OD for 7 days' },
    { name: 'Glucophage 500mg', genericName: 'Metformin HCl', category: 'Antidiabetic', dosageForm: 'Tablet', commonDosage: '1 tab BD with meals' },
    { name: 'Softin 10mg', genericName: 'Loratadine', category: 'Antihistamine', dosageForm: 'Tablet', commonDosage: '1 tab at night' },
    { name: 'Voltral 50mg', genericName: 'Diclofenac Sodium', category: 'NSAID', dosageForm: 'Tablet', commonDosage: '1 tab BD PRN' },
    { name: 'Norvasc 5mg', genericName: 'Amlodipine', category: 'Antihypertensive', dosageForm: 'Tablet', commonDosage: '1 tab OD morning' },
    { name: 'Brufen 400mg', genericName: 'Ibuprofen', category: 'NSAID', dosageForm: 'Tablet', commonDosage: '1 tab TDS after food' },
    { name: 'Flagyl 400mg', genericName: 'Metronidazole', category: 'Antimicrobial', dosageForm: 'Tablet', commonDosage: '1 tab TDS for 5 days' },
    { name: 'Hydryllin Syrup', genericName: 'Aminophylline compound', category: 'Cough Sedative', dosageForm: 'Syrup', commonDosage: '2 tsp TDS' },
    { name: 'Zestril 10mg', genericName: 'Lisinopril', category: 'ACE Inhibitor', dosageForm: 'Tablet', commonDosage: '1 tab OD' },
  ];

  for (const m of medicines) {
    await prisma.medicine.upsert({
      where: { name: m.name },
      update: m,
      create: m,
    });
  }

  // 6. Seed 50 Demo Patients
  console.log('Seeding 50 Demo Patients...');
  const firstNames = ['Muhammad', 'Ali', 'Ahmed', 'Fatima', 'Ayesha', 'Zainab', 'Usman', 'Bilal', 'Hassan', 'Hussein', 'Hamza', 'Khadija', 'Maryam', 'Tariq', 'Sajid', 'Rashid', 'Farhan', 'Naveed', 'Imran', 'Irfan'];
  const lastNames = ['Khan', 'Malik', 'Chaudhry', 'Bhatti', 'Sheikh', 'Butt', 'Raza', 'Qureshi', 'Ansari', 'Mirza', 'Javed', 'Akram', 'Rehman', 'Siddiqui', 'Gill'];
  const bloodGroups = ['B+', 'O+', 'A+', 'AB+', 'B-', 'O-', 'A-'];
  const allergiesList = ['None reported', 'Penicillin', 'Sulfa drugs', 'Aspirin', 'Dust / Pollen', 'None reported', 'None reported', 'NSAIDs'];
  const areas = ['Gulberg III', 'Model Town', 'DHA Phase 5', 'Johar Town', 'Cantt', 'Faisal Town', 'Shadman', 'Allama Iqbal Town', 'Garden Town', 'Cavalry Ground'];

  const seededPatients = [];
  for (let i = 1; i <= 50; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const fullName = `${fn} ${ln}`;
    const mrNumber = `NIH-2026-${String(i).padStart(6, '0')}`;
    const cnic = `35201-${String(1000000 + i * 1793).substring(0, 7)}-${(i % 9) + 1}`;
    const mobile = `03${String(i % 5)}${String(10000000 + i * 29134).substring(0, 8)}`;
    const gender = (i % 3 === 0) ? 'FEMALE' : 'MALE';
    const age = 18 + (i * 7) % 65;
    const address = `House ${12 + i}, Street ${(i % 10) + 1}, ${areas[i % areas.length]}`;
    const bloodGroup = bloodGroups[i % bloodGroups.length];
    const allergies = allergiesList[i % allergiesList.length];

    const p = await prisma.patient.upsert({
      where: { mrNumber },
      update: {},
      create: {
        mrNumber,
        fullName,
        fatherOrHusbandName: `${firstNames[(i + 4) % firstNames.length]} ${ln}`,
        age,
        gender,
        cnic,
        mobile,
        address,
        city: 'Lahore',
        bloodGroup,
        allergies,
        emergencyContact: `0300-${String(9000000 + i * 1234).substring(0, 7)}`,
      },
    });
    seededPatients.push(p);
  }

  // 7. Seed Sample Visits for Today
  console.log('Seeding Today OPD Queue Visits...');
  const todayStr = new Date().toISOString().split('T')[0];
  const statuses = ['WAITING', 'WAITING', 'IN_CONSULTATION', 'COMPLETED', 'COMPLETED'];

  for (let i = 0; i < 15; i++) {
    const patient = seededPatients[i];
    const doctor = seededDoctors[i % seededDoctors.length];
    const tokenNumber = Math.floor(i / seededDoctors.length) + 1;
    const visitNumber = `VIS-2026-${String(i + 1).padStart(6, '0')}`;
    const status = statuses[i % statuses.length];
    const priority = (i === 1) ? 'EMERGENCY' : 'NORMAL';

    const existingVisit = await prisma.visit.findUnique({ where: { visitNumber } });
    if (!existingVisit) {
      const v = await prisma.visit.create({
        data: {
          visitNumber,
          patientId: patient.id,
          doctorId: doctor.id,
          departmentId: doctor.departmentId,
          tokenNumber,
          tokenDate: todayStr,
          visitType: (priority === 'EMERGENCY') ? 'EMERGENCY' : 'OPD',
          status,
          priority,
          consultationFee: doctor.fee,
          discountAmount: (i === 4) ? 200 : 0,
          netAmount: doctor.fee - ((i === 4) ? 200 : 0),
          paymentStatus: 'PAID',
          paymentMethod: (i % 2 === 0) ? 'CASH' : 'JAZZCASH',
          calledAt: (status === 'IN_CONSULTATION' || status === 'COMPLETED') ? new Date() : null,
          completedAt: (status === 'COMPLETED') ? new Date() : null,
        },
      });

      // If completed, add a prescription
      if (status === 'COMPLETED') {
        const rx = await prisma.prescription.create({
          data: {
            visitId: v.id,
            patientId: patient.id,
            doctorId: doctor.id,
            diagnosis: 'Acute upper respiratory tract infection & mild hypertension',
            symptoms: 'Fever, cough, sore throat for 3 days',
            clinicalNotes: 'Chest clear bilaterally, throat congested, vitals stable.',
            bloodPressure: '130/85 mmHg',
            pulse: '78 bpm',
            temperature: '99.2 F',
            weight: '72 kg',
            oxygenSaturation: '98%',
            followUpDate: 'In 5 days if fever persists',
          },
        });

        await prisma.prescriptionItem.createMany({
          data: [
            { prescriptionId: rx.id, medicineName: 'Panadol 500mg', dosage: '500mg', frequency: '1-1-1', duration: '3 days', instructions: 'After meals' },
            { prescriptionId: rx.id, medicineName: 'Augmentin 625mg', dosage: '625mg', frequency: '1-0-1', duration: '5 days', instructions: 'With meals' },
            { prescriptionId: rx.id, medicineName: 'Hydryllin Syrup', dosage: '10ml', frequency: 'TDS', duration: '5 days', instructions: 'When coughing' },
          ],
        });
      }

      // Add a Bill
      const inv = await prisma.bill.create({
        data: {
          invoiceNo: `INV-2026-${String(i + 1).padStart(6, '0')}`,
          visitId: v.id,
          patientId: patient.id,
          subtotal: doctor.fee,
          discount: (i === 4) ? 200 : 0,
          total: doctor.fee - ((i === 4) ? 200 : 0),
          paidAmount: doctor.fee - ((i === 4) ? 200 : 0),
          balance: 0,
          paymentMethod: (i % 2 === 0) ? 'CASH' : 'JAZZCASH',
          paymentStatus: 'PAID',
        },
      });

      await prisma.billItem.create({
        data: {
          billId: inv.id,
          itemType: 'CONSULTATION',
          description: `OPD Consultation - ${doctor.name} (${doctor.specialty})`,
          quantity: 1,
          unitPrice: doctor.fee,
          amount: doctor.fee,
        },
      });
    }
  }

  // 8. Seed Sample Appointments
  console.log('Seeding Sample Appointments...');
  const timeSlots = ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'];
  for (let i = 0; i < 8; i++) {
    const patient = seededPatients[20 + i];
    const doctor = seededDoctors[i % seededDoctors.length];
    const ref = `APT-2026-${String(i + 1).padStart(4, '0')}`;
    const slot = timeSlots[i % timeSlots.length];

    await prisma.appointment.upsert({
      where: { referenceNo: ref },
      update: {},
      create: {
        referenceNo: ref,
        patientId: patient.id,
        patientName: patient.fullName,
        patientMobile: patient.mobile,
        patientCnic: patient.cnic,
        doctorId: doctor.id,
        departmentId: doctor.departmentId,
        appointmentDate: todayStr,
        timeSlot: slot,
        type: (i % 2 === 0) ? 'ONLINE' : 'WALK_IN',
        status: 'CONFIRMED',
        notes: 'Patient requesting follow-up examination.',
        reminderSent: true,
      },
    });
  }

  console.log('--- Seed Finished Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
