import type { Metadata, Viewport } from "next";
import { Poppins, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-noto-urdu",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Naseem Ijaz Hospital | Reception & Patient Management System",
  description:
    "Leading healthcare facility in Lahore, Pakistan. Fast patient registration, real-time doctor OPD queues, automated billing, and live waiting room displays.",
  keywords: [
    "Hospital Lahore",
    "Naseem Ijaz Hospital",
    "OPD Queue Management",
    "Patient Registration",
    "Online Doctor Appointment Lahore",
    "Pakistan Healthcare",
  ],
  authors: [{ name: "Naseem Ijaz Hospital" }],
  openGraph: {
    title: "Naseem Ijaz Hospital - Lahore",
    description: "Smarter care starts at the front desk. State-of-the-art reception & OPD management.",
    url: "https://naseemijazhospital.pk",
    siteName: "Naseem Ijaz Hospital",
    locale: "en_PK",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
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
      <body className={`${poppins.variable} ${notoUrdu.variable} font-sans min-h-screen antialiased selection:bg-teal-500 selection:text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
