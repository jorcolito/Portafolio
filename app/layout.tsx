import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020305",
};

export const metadata: Metadata = {
  title: "Jorge Colamarco — Portafolio interactivo",
  description:
    "Portafolio interactivo bilingüe de Jorge Colamarco: proyectos reales, producto, tecnologías, formación y contacto profesional.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Jorge Colamarco — Portafolio interactivo",
    description:
      "Explora proyectos, criterio de producto y capacidades full stack en una experiencia bilingüe.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jorge Colamarco — Portafolio interactivo",
    description: "Software, producto y criterio en una experiencia interactiva.",
    images: ["/og.png"],
  },
};

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jorge Colamarco",
  jobTitle: "Product-minded software developer",
  homeLocation: {
    "@type": "Place",
    name: "Guayaquil, Ecuador",
  },
  email: "mailto:jorgecolamarco03@gmail.com",
  sameAs: [
    "https://github.com/jorcolito",
    "https://www.linkedin.com/in/jorge-colamarco-a82456266/",
    "https://www.chess.com/member/jorcolito",
  ],
  knowsLanguage: ["es", "en"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        {children}
        <noscript>
          <main className="noscript-fallback">
            <p>Jorge Colamarco · Portafolio interactivo</p>
            <h1>Software útil, pensado como producto.</h1>
            <p>
              Desarrollo productos web de extremo a extremo, desde el problema
              operativo y la experiencia de usuario hasta los datos y la entrega.
            </p>
            <p>Proyectos destacados: CarDrive, SHIKO y Comernova.</p>
            <nav aria-label="Contacto profesional">
              <a href="mailto:jorgecolamarco03@gmail.com">Email</a>
              <a href="https://github.com/jorcolito">GitHub</a>
              <a href="https://www.linkedin.com/in/jorge-colamarco-a82456266/">
                LinkedIn
              </a>
            </nav>
          </main>
        </noscript>
      </body>
    </html>
  );
}
