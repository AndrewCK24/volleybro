import { Link } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="flex flex-row flex-wrap items-start justify-center w-full pb-8 bg-foreground md:px-[5%]">
      <Section>
        <p className="text-lg font-medium text-center text-background">
          © 2025 VolleyBro
        </p>
      </Section>
      <Section>
        <p className="text-lg font-medium text-center text-background">
          Made with ❤️ by{" "}
          <Link
            href="https://www.linkedin.com/in/li-wei-tseng-andrew/"
            variant="link"
            className="p-0 text-lg"
          >
            Andrew Tseng
          </Link>
        </p>
      </Section>
    </footer>
  );
};

const Section = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col items-start justify-start gap-2 px-8 py-4 grow basis-80 shrink-0">
      {children}
    </section>
  );
};
