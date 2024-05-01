import { Header } from "../components/layout/Header";
import { Main } from "../components/layout/Main";
import { Nav } from "../../components/layout/Nav";

const ProtectedLayout = async ({ children }) => {
  return (
    <>
      <Main>{children}</Main>
      <Header />
      <Nav />
    </>
  );
};

export default ProtectedLayout;
