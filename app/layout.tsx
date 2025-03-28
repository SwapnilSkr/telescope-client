import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const Helvetica = localFont({
  src: "./fonts/Hnfonts/HelveticaNeueBlack.otf",
  variable: "--font-helvetica",
  weight: "100 900",
});

const HelveticaNeueLight = localFont({
  src: "./fonts/Hnfonts/HelveticaNeueLight.otf",
  variable: "--font-helvetica-light",
  weight: "100 900",
});

const HelveticaNeueMedium = localFont({
  src: "./fonts/Hnfonts/HelveticaNeueMedium.otf",
  variable: "--font-helvetica-medium",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Telescope",
  description: "Track, Analyze & Stay Ahead of Cyber Threats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${Helvetica.variable} ${HelveticaNeueLight.variable} ${HelveticaNeueMedium.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
