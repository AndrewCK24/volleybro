import { Main } from "../../components/layout/Main";

const AuthLayout = ({ children }) => {
  return (
    <Main className="gap-0 p-0 overflow-hidden overscroll-y-none">
      {children}
    </Main>
  );
};

export default AuthLayout;
