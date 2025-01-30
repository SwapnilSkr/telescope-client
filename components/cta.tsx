import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-slate-50">
      <div className="py-24 sm:py-32">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to enhance your cybersecurity?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Start monitoring Telegram channels for real-time cyber threat
            intelligence today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/signup" passHref>
              <Button size="lg">Get started</Button>
            </Link>
            <Link href="#contact" className="text-sm font-semibold leading-6">
              Contact sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
