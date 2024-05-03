import { Main } from "@/components/layout/Main";
import { Logo } from "@/components/custom/Logo";

const AuthLayout = ({ children }) => {
  return (
    <Main className="gap-0 p-0 overflow-hidden overscroll-y-none bg-primary">
      <Logo />
      {children}
    </Main>
  );
};

export default AuthLayout;
