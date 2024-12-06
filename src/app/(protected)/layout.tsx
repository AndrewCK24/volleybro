import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Nav } from "@/components/layout/nav";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Main>
        <div className="flex flex-col items-center justify-start gap-2 flex-nowrap max-w-[640px] w-full">
          {children}
        </div>
      </Main>
      <Header />
      <Nav />
    </>
  );
};

export default ProtectedLayout;
