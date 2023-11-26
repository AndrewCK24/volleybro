import { Main } from "../components/layout/Main";

const AuthLayout = ({ children }) => {
  return (
    <Main full noGap>
      {children}
    </Main>
  );
};

export default AuthLayout;
