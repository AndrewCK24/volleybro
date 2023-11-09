import { Main } from "../components/layout/Main";

const AuthLayout = ({ children }) => {
  return <Main full={true}>{children}</Main>;
};

export default AuthLayout;
