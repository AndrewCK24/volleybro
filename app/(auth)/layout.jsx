import { Main } from "../components/layout/Main";

export const metadata = {
  themeColor: "#dddcdd",
};

const AuthLayout = ({ children }) => {
  return <Main full>{children}</Main>;
};

export default AuthLayout;
