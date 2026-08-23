import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { getSiteSettings } from "@/lib/data/site-settings";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();
  const sameAs = [siteSettings.instagram_url, siteSettings.facebook_url, siteSettings.tiktok_url].filter(Boolean);

  return (
    <html lang="fr">
      <head>
        {/* JSON-LD Structured Data pour Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // .replace(/</g, '\\u003c') : JSON.stringify n'échappe pas "<",
            // donc une valeur admin (site_settings) contenant "</script>"
            // pourrait sinon casser hors du tag et injecter du JS (XSS stocké).
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "FlexServeStudio",
              image: "https://www.flexservestudio.com/logo.png",
              description:
                "Photographie et vidéographie professionnelle à Dakar, spécialisé en mariages, événements, publicité et portraits.",
              email: siteSettings.contact_email,
              telephone: siteSettings.contact_phone,
              address: {
                "@type": "PostalAddress",
                addressLocality: siteSettings.address.split(",")[0]?.trim() || "Dakar",
                addressCountry: "SN",
              },
              url: "https://www.flexservestudio.com",
              sameAs,
            }).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteChrome siteSettings={siteSettings}>{children}</SiteChrome>
      </body>
    </html>
  );
}