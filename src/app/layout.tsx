import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photo Collage Generator - Create Unique Collages",
  description: "Create and customize high-resolution photo collages with classic & stylish layouts, text, and frames.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ff2b6d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Bangers&family=Caveat:wght@600;700&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@700&family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@500;700;900&family=Oswald:wght@500;700&family=Pacifico&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Poppins:wght@500;700;800&family=Space+Grotesk:wght@500;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-neutral-100 select-none overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
