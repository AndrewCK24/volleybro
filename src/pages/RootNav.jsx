import { Container, PagesContainer } from "./Root";
import { Outlet } from "react-router-dom";

import Header from "../components/root/Header";
import BottomNav from "../components/root/BottomNav";
import StartRecordBtn from "../components/root/StartRecordBtn";

const RootNavLayout = () => {
  return (
    <Container>
      <Header />
      <PagesContainer>
        <Outlet />
      </PagesContainer>
      <StartRecordBtn />
      <BottomNav />
    </Container>
  );
};

export default RootNavLayout;
