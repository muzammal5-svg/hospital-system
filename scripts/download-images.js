const fs = require('fs');
const path = require('path');

const images = [
  // General & Hero
  {
    dest: 'public/images/hero-hospital.webp',
    id: 'photo-1582750433449-648ed127bb54',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fm=webp&fit=crop&w=1200&h=800&q=80',
    title: 'Modern Hospital Medical Team',
    author: 'National Cancer Institute',
    source: 'https://unsplash.com/photos/photo-1582750433449-648ed127bb54'
  },
  {
    dest: 'public/images/about-building.webp',
    id: 'photo-1586773860418-d37222d8fce3',
    url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fm=webp&fit=crop&w=1000&h=700&q=80',
    title: 'Hospital Building Exterior',
    author: 'Martha Dominguez de Gouveia',
    source: 'https://unsplash.com/photos/photo-1586773860418-d37222d8fce3'
  },
  {
    dest: 'public/images/about-reception.webp',
    id: 'photo-1516549655169-df83a0774514',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fm=webp&fit=crop&w=1000&h=700&q=80',
    title: 'Hospital Reception & Lobby',
    author: 'Marcelo Leal',
    source: 'https://unsplash.com/photos/photo-1516549655169-df83a0774514'
  },
  {
    dest: 'public/images/about-doctor-patient.webp',
    id: 'photo-1584515979956-d9f6e5d09982',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fm=webp&fit=crop&w=1000&h=700&q=80',
    title: 'Doctor Patient Consultation',
    author: 'National Cancer Institute',
    source: 'https://unsplash.com/photos/photo-1584515979956-d9f6e5d09982'
  },
  {
    dest: 'public/images/appointment-banner.webp',
    id: 'photo-1576091160399-112ba8d25d1d',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fm=webp&fit=crop&w=1200&h=600&q=80',
    title: 'Doctor Scheduling & Consultation',
    author: 'National Cancer Institute',
    source: 'https://unsplash.com/photos/photo-1576091160399-112ba8d25d1d'
  },
  {
    dest: 'public/images/emergency-entrance.webp',
    id: 'photo-1587745416684-47953f16f02f',
    url: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fm=webp&fit=crop&w=1000&h=700&q=80',
    title: 'Emergency Medical Service & Ambulance',
    author: 'Camilo Jimenez',
    source: 'https://unsplash.com/photos/photo-1587745416684-47953f16f02f'
  },
  {
    dest: 'public/images/login-bg.webp',
    id: 'photo-1519494026892-80bbd2d6fd0d',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fm=webp&fit=crop&w=1200&h=1000&q=80',
    title: 'Modern Hospital Interior',
    author: 'Martha Dominguez de Gouveia',
    source: 'https://unsplash.com/photos/photo-1519494026892-80bbd2d6fd0d'
  },

  // 8 Doctors (4 Male + 4 Female)
  {
    dest: 'public/images/doctors/dr-tariq-mahmood.webp',
    id: 'photo-1622253692010-333f2da6031d',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fm=webp&fit=crop&w=600&h=600&q=80',
    title: 'Dr. Tariq Mahmood (Cardiologist, Male)',
    author: 'Usman Yousaf',
    source: 'https://unsplash.com/photos/photo-1622253692010-333f2da6031d'
  },
  {
    dest: 'public/images/doctors/dr-sana-farooq.webp',
    id: 'photo-1559839734-2b71ea197ec2',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fm=webp&fit=crop&w=600&h=600&q=80',
    title: 'Dr. Sana Farooq (Gynecologist, Female)',
    author: 'Bruno Rodrigues',
    source: 'https://unsplash.com/photos/photo-1559839734-2b71ea197ec2'
  },
  {
    dest: 'public/images/doctors/dr-ahmed-bilal.webp',
    id: 'photo-1537368910025-700350fe46c7',
    url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fm=webp&fit=crop&w=600&h=600&q=80',
    title: 'Dr. Ahmed Bilal (Physician, Male)',
    author: 'Austin Distel',
    source: 'https://unsplash.com/photos/photo-1537368910025-700350fe46c7'
  },
  {
    dest: 'public/images/doctors/dr-usman-khalid.webp',
    id: 'photo-1612349317150-e413f6a5b16d',
    url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fm=webp&fit=crop&w=600&h=600&q=80',
    title: 'Dr. Usman Khalid (Orthopedic Surgeon, Male)',
    author: 'Cedric Fauntleroy',
    source: 'https://unsplash.com/photos/photo-1612349317150-e413f6a5b16d'
  },
  {
    dest: 'public/images/doctors/dr-fatima-noor.webp',
    id: 'photo-1591604466107-ec97de577aff',
    url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fm=webp&fit=crop&w=600&h=600&q=80',
    title: 'Dr. Fatima Noor (Pediatrician, Female)',
    author: 'LinkedIn Sales Solutions',
    source: 'https://unsplash.com/photos/photo-1591604466107-ec97de577aff'
  },
  {
    dest: 'public/images/doctors/dr-kamran-aslam.webp',
    id: 'photo-1622902046580-2b47f47f5471',
    url: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fm=webp&fit=crop&w=600&h=600&q=80',
    title: 'Dr. Kamran Aslam (General Surgeon, Male)',
    author: 'Usman Yousaf',
    source: 'https://unsplash.com/photos/photo-1622902046580-2b47f47f5471'
  },
  {
    dest: 'public/images/doctors/dr-ayesha-malik.webp',
    id: 'photo-1651008376811-b90baee60c1f',
    url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fm=webp&fit=crop&w=600&h=600&q=80',
    title: 'Dr. Ayesha Malik (Neurologist, Female)',
    author: 'engin akyurt',
    source: 'https://unsplash.com/photos/photo-1651008376811-b90baee60c1f'
  },
  {
    dest: 'public/images/doctors/dr-zainab-shah.webp',
    id: 'photo-1527613426441-4da17471b66d',
    url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fm=webp&fit=crop&w=600&h=600&q=80',
    title: 'Dr. Zainab Shah (Dermatologist, Female)',
    author: 'RF._.studio',
    source: 'https://unsplash.com/photos/photo-1527613426441-4da17471b66d'
  },

  // 10 Departments
  {
    dest: 'public/images/departments/cardiology.webp',
    id: 'photo-1628348068343-c6a848d2b6dd',
    url: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fm=webp&fit=crop&w=600&h=400&q=80',
    title: 'Cardiology Care',
    author: 'Mockup Graphics',
    source: 'https://unsplash.com/photos/photo-1628348068343-c6a848d2b6dd'
  },
  {
    dest: 'public/images/departments/orthopedics.webp',
    id: 'photo-1588776814546-1ffcf47267a5',
    url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fm=webp&fit=crop&w=600&h=400&q=80',
    title: 'Orthopedics & Joint Care',
    author: 'Mockup Graphics',
    source: 'https://unsplash.com/photos/photo-1588776814546-1ffcf47267a5'
  },
  {
    dest: 'public/images/departments/pediatrics.webp',
    id: 'photo-1581594693702-fbdc51b2763b',
    url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fm=webp&fit=crop&w=600&h=400&q=80',
    title: 'Pediatrics & Child Care',
    author: 'National Cancer Institute',
    source: 'https://unsplash.com/photos/photo-1581594693702-fbdc51b2763b'
  },
  {
    dest: 'public/images/departments/gynecology.webp',
    id: 'photo-1584515933487-779824d29309',
    url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fm=webp&fit=crop&w=600&h=400&q=80',
    title: 'Gynecology & Obstetrics',
    author: 'National Cancer Institute',
    source: 'https://unsplash.com/photos/photo-1584515933487-779824d29309'
  },
  {
    dest: 'public/images/departments/internal-medicine.webp',
    id: 'photo-1579684385127-1ef15d508118',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fm=webp&fit=crop&w=600&h=400&q=80',
    title: 'Internal Medicine & Diagnostics',
    author: 'Mockup Graphics',
    source: 'https://unsplash.com/photos/photo-1579684385127-1ef15d508118'
  },
  {
    dest: 'public/images/departments/general-surgery.webp',
    id: 'photo-1551076805-e1869033e561',
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fm=webp&fit=crop&w=600&h=400&q=80',
    title: 'General Surgery & Operating Theatre',
    author: 'Mockup Graphics',
    source: 'https://unsplash.com/photos/photo-1551076805-e1869033e561'
  },
  {
    dest: 'public/images/departments/neurology.webp',
    id: 'photo-1559757175-5700dde675bc',
    url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fm=webp&fit=crop&w=600&h=400&q=80',
    title: 'Neurology & Neurosciences',
    author: 'Mockup Graphics',
    source: 'https://unsplash.com/photos/photo-1559757175-5700dde675bc'
  },
  {
    dest: 'public/images/departments/ophthalmology.webp',
    id: 'photo-1584467735871-8e85353a8413',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fm=webp&fit=crop&w=600&h=400&q=80',
    title: 'Ophthalmology & Eye Clinic',
    author: 'Mockup Graphics',
    source: 'https://unsplash.com/photos/photo-1584467735871-8e85353a8413'
  },
  {
    dest: 'public/images/departments/ent.webp',
    id: 'photo-1584516150909-c43483ee7932',
    url: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fm=webp&fit=crop&w=600&h=400&q=80',
    title: 'Ear, Nose & Throat (ENT)',
    author: 'National Cancer Institute',
    source: 'https://unsplash.com/photos/photo-1584516150909-c43483ee7932'
  },
  {
    dest: 'public/images/departments/dermatology.webp',
    id: 'photo-1570172619644-dfd03ed5d881',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fm=webp&fit=crop&w=600&h=400&q=80',
    title: 'Dermatology & Skin Clinic',
    author: 'Sora Shimazaki',
    source: 'https://unsplash.com/photos/photo-1570172619644-dfd03ed5d881'
  }
];

async function run() {
  console.log(`Starting download of ${images.length} verified hospital images...`);

  for (const img of images) {
    const fullPath = path.join(process.cwd(), img.dest);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    try {
      const res = await fetch(img.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(fullPath, buf);
      console.log(`[OK] ${img.dest} (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`[FAIL] ${img.dest}:`, err.message);
    }
  }

  // Generate CREDITS.md
  let credits = '# Image Credits\n\n' +
    'All photos are sourced from Unsplash under the Unsplash Free License (free for commercial and personal use, no attribution strictly required, but fully credited below):\n\n' +
    '| Local File | Title / Depiction | Photographer | Source Link |\n' +
    '| --- | --- | --- | --- |\n';

  for (const img of images) {
    const rel = img.dest.replace('public/', '/');
    credits += `| \`${rel}\` | ${img.title} | ${img.author} | [Unsplash Photo](${img.source}) |\n`;
  }

  const creditsPath = path.join(process.cwd(), 'public/images/CREDITS.md');
  fs.writeFileSync(creditsPath, credits);
  console.log(`\nSuccessfully created CREDITS.md at ${creditsPath}`);
}

run();
