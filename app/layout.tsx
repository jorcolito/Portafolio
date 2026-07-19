import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020305",
};

export const metadata: Metadata = {
  title: "JORGE.EXE — A Developer's Tale",
  description:
    "Explora el laboratorio interactivo de Jorge Colamarco: proyectos reales, educación y una historia construida con código.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "JORGE.EXE — A Developer's Tale",
    description:
      "Un portafolio jugable sobre software, productos y las ideas de Jorge Colamarco.",
    images: [{ url: "/og.png", width: 1735, height: 907 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JORGE.EXE — A Developer's Tale",
    description: "El portafolio jugable de Jorge Colamarco.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
