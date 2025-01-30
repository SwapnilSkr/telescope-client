import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Telescope: Your Cybersecurity Intelligence Hub
      </h1>
      <p className="max-w-[700px] text-lg text-muted-foreground">
        Monitor Telegram channels for real-time cyber threat intelligence. Stay
        ahead of potential risks with our advanced tracking and analysis tools.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/signup" passHref>
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="#features" passHref>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </Link>
      </div>
    </section>
  );
}
