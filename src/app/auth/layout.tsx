import { Main } from "@/components/layout/main";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Main className="justify-end gap-0 p-0 overflow-hidden overscroll-y-none bg-primary">
      {children}
    </Main>
  );
};

export default AuthLayout;
