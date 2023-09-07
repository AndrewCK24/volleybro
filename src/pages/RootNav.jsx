import { Container, PagesContainer } from "./Root";
import { Outlet } from "react-router-dom";

import Header from "../components/root/Header";
import BottomNav from "../components/root/BottomNav";

const RootNavLayout = () => {
  return (
    <Container>
      <Header />
      <PagesContainer>
        <Outlet />
      </PagesContainer>
      <BottomNav />
    </Container>
  );
};

export default RootNavLayout;
