import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";
import { Roboto } from "next/font/google";
import { ReactNode } from "react";
import type { Metadata } from "next";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub — простий та ефективний застосунок для керування нотатками.",
  openGraph: {
    title: "NoteHub",
    description: "Простий та ефективний застосунок для керування нотатками.",
    url: "https://notehub.app",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
      },
    ],
  },
};

interface RootLayoutProps {
  children: ReactNode;
  modal?: ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <TanStackProvider>
          <Header />
          {children}
          {modal ?? null}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
