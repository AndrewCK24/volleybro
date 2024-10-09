import { Main } from "@/components/layout/main";
import { Logo } from "@/components/custom/logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Main className="gap-0 p-0 overflow-hidden overscroll-y-none bg-primary">
      <Logo />
      {children}
    </Main>
  );
};

export default AuthLayout;
