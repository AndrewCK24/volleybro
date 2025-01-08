import { Hero } from "@/components/landing/hero";

const IntroductionPage = () => {
  return (
    <main className="w-full min-h-full bg-primary">
      <Hero />
      <section className="flex flex-col items-center justify-center w-full h-screen bg-background"></section>
    </main>
  );
};

export default IntroductionPage;
