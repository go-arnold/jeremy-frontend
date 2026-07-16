import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Btnlive from "@/components/layout/Btnlive";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://artdukivu.com"),
  title: "Art du Kivu",
  description: "Plateforme culturelle et sonore du Kivu",
  openGraph: {
    title: "Art du Kivu",
    description: "Plateforme culturelle et sonore du Kivu",
    images: ["/kIconne.png"],
  },
  icons: { icon: "/kIconne.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Epilogue:wght@300;400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#12223c] font-display text-white antialiased selection:bg-primary selection:text-white">

        <AuthProvider>
          {/* Header fixe */}
          <Header />

          {/* Navbar : bottom bar mobile, sidebar desktop */}
          <Navbar />

          <div className="flex min-h-screen flex-col lg:pl-56">
            <main className="flex-1 relative overflow-x-clip kivu-texture pt-16
              /* Mobile : padding bottom pour la bottom bar (h ~56px) */
              pb-16
              /* Desktop : pas de padding bottom supplémentaire */
              lg:pb-0
            ">
              {children}
            </main>
            <Footer />
          </div>

          <Btnlive />
        </AuthProvider>

      </body>
    </html>
  );
}
