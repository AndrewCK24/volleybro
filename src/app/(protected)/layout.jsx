import { Header } from "@/src/components/layout/header";
import { Main } from "@/src/components/layout/main";
import { Nav } from "@/src/components/layout/nav";

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
