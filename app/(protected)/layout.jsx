import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Nav } from "@/components/layout/nav";

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
