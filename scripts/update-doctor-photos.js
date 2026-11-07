const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const doctorPhotos = [
  {
    nameMatch: 'Tariq Mahmood',
    photoUrl: '/images/doctors/dr-tariq-mahmood.webp',
  },
  {
    nameMatch: 'Sana Farooq',
    photoUrl: '/images/doctors/dr-sana-farooq.webp',
  },
  {
    nameMatch: 'Ahmed Bilal',
    photoUrl: '/images/doctors/dr-ahmed-bilal.webp',
  },
  {
    nameMatch: 'Usman Khalid',
    photoUrl: '/images/doctors/dr-usman-khalid.webp',
  },
  {
    nameMatch: 'Fatima Noor',
    photoUrl: '/images/doctors/dr-fatima-noor.webp',
  },
  {
    nameMatch: 'Kamran Aslam',
    photoUrl: '/images/doctors/dr-kamran-aslam.webp',
  },
  {
    nameMatch: 'Ayesha Malik',
    photoUrl: '/images/doctors/dr-ayesha-malik.webp',
  },
  {
    nameMatch: 'Zubair',
    nameNew: 'Dr. Zainab Shah',
    nameUrdu: 'ڈاکٹر زینب شاہ',
    email: 'zainab.derm@naseemijaz.pk',
    photoUrl: '/images/doctors/dr-zainab-shah.webp',
  },
];

async function update() {
  for (const doc of doctorPhotos) {
    const found = await prisma.doctor.findFirst({
      where: { name: { contains: doc.nameMatch } },
    });
    if (found) {
      await prisma.doctor.update({
        where: { id: found.id },
        data: {
          photoUrl: doc.photoUrl,
          ...(doc.nameNew ? { name: doc.nameNew, nameUrdu: doc.nameUrdu, email: doc.email } : {}),
        },
      });
      console.log(`Updated ${found.name} -> photo: ${doc.photoUrl}`);
    }
  }

  // Also update HospitalProfile logoUrl
  await prisma.hospitalProfile.update({
    where: { id: 'default' },
    data: {
      logoUrl: '/images/logo.svg',
    },
  });
  console.log('Updated hospital profile logoUrl to /images/logo.svg');
}

update()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
