import { Main } from "@/src/components/layout/main";
import { Logo } from "@/src/components/custom/logo";

const AuthLayout = ({ children }) => {
  return (
    <Main className="gap-0 p-0 overflow-hidden overscroll-y-none bg-primary">
      <Logo />
      {children}
    </Main>
  );
};

export default AuthLayout;
