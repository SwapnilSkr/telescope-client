import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="grid gap-10 px-4 sm:px-6 lg:px-10 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Get in touch</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Have questions about Telescope? We&apos;re here to help. Fill out
            the form and we&apos;ll be in touch as soon as possible.
          </p>
        </div>
        <form className="flex flex-col gap-4">
          <Input placeholder="Name" />
          <Input type="email" placeholder="Email" />
          <Textarea placeholder="Message" />
          <Button type="submit" className="w-full sm:w-auto">
            Send message
          </Button>
        </form>
      </div>
    </section>
  );
}
