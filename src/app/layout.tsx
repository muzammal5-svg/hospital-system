import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-noto-urdu",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Naseem Ijaz Hospital | Patient Care & Outpatient Services - Lahore",
  description:
    "Trusted consultation, diagnostics, outpatient clinics and 24/7 emergency care in Lahore, Pakistan. Book doctor appointments, view live OPD queues, and manage consultations.",
  keywords: [
    "Hospital Lahore",
    "Naseem Ijaz Hospital",
    "Jail Road Hospital Lahore",
    "OPD Consultations Lahore",
    "Doctor Appointment Lahore",
    "Emergency Care Lahore",
  ],
  authors: [{ name: "Naseem Ijaz Hospital" }],
  openGraph: {
    title: "Naseem Ijaz Hospital - Lahore",
    description: "Quality Healthcare, Close to Home. Trusted consultation, diagnostics and emergency care in Lahore.",
    url: "https://naseemijazhospital.pk",
    siteName: "Naseem Ijaz Hospital",
    locale: "en_PK",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B4F8A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${notoUrdu.variable} font-sans min-h-screen antialiased bg-[#F6F9FC] dark:bg-[#0F1B2A] text-[#1B2733] dark:text-[#E6EEF5] selection:bg-[#E8F1F9] selection:text-[#0B4F8A]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
