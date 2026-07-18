import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
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
}

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
