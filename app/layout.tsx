import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlexServeStudio - Photographe & Vidéaste à Dakar, Sénégal",
  description:
    "FlexServeStudio Dakar propose des services professionnels de photographie et vidéographie, spécialisé en mariages, événements, publicité et portraits.",
  keywords:
    "photographe Dakar, vidéaste Dakar, mariage Dakar, portrait photo, photographie événementielle, publicité, FlexServeStudio flexserve studio, photographe professionnel, vidéographie professionnelle, services photo Dakar, services vidéo Dakar drone, photographie de mariage, photographie de portrait, photographie d'événement, vidéographie de mariage, vidéographie d'événement, vidéographie publicitaire Dakar ",
  authors: [{ name: "FlexServeStudio" }],
  creator: "FlexServeStudio",
  openGraph: {
    title: "FlexServeStudio - Photographe & Vidéaste à Dakar",
    description:
      "Services professionnels de photographie et vidéographie à Dakar : mariages, événements, publicité et portraits.",
    url: "https://www.flexservestudio.com",
    siteName: "FlexServeStudio Dakar",
    images: [
      {
        url: "https://www.flexservestudio.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Portfolio FlexServeStudio Dakar",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlexServeStudio - Photographe & Vidéaste à Dakar",
    description:
      "Services professionnels en mariages, événements, publicité et portraits à Dakar.",
    images: ["https://www.flexservestudio.com/logo.png"],
  },
  metadataBase: new URL("https://www.flexservestudio.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* JSON-LD Structured Data pour Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "FlexServeStudio",
              image: "https://www.flexservestudio.com/logo.png",
              description:
                "Photographie et vidéographie professionnelle à Dakar, spécialisé en mariages, événements, publicité et portraits.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dakar",
                addressCountry: "SN",
              },
              url: "https://www.flexservestudio.com",
              sameAs: [
                "https://www.instagram.com/flexserve_studio?igsh=NWx6bXoyYnVzcGtj&utm_source=qr",
                "https://www.facebook.com/share/1AgBWggXkW/?mibextid=wwXIfr",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}