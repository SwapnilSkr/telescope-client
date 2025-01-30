// app/landing/page.tsx
"use client"; // Ensure this component runs only on the client side

import { useEffect } from "react";
import useUserStore from "@/stores/userStore";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import CTA from "@/components/cta";
import Contact from "@/components/contact";

export default function LandingPage() {
  const { fetchUser } = useUserStore();

  // Fetch user on page mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <CTA />
        <Contact />
      </main>
      <footer className="py-6 md:py-0 md:px-6 lg:px-10 md:h-24 border-t">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Telescope
            </a>
            . The source code is available on{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
