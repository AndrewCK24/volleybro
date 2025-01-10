import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";

const LandingPage = () => {
  return (
    <main className="w-full min-h-full bg-primary">
      <Hero />
      <Features />
      <footer className="w-full h-[30vh] bg-foreground" />
    </main>
  );
};

export default LandingPage;
