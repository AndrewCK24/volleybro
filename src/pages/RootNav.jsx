import { Container, PagesContainer } from "./Root";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import Header from "../components/root/Header";
import BottomNav from "../components/root/BottomNav";
import StartRecordBtn from "../components/root/StartRecordBtn";

const RootNavLayout = () => {
  const teamId = useSelector((state) => state.team._id);
  return (
    <Container>
      <Header />
      <PagesContainer>
        <Outlet />
      </PagesContainer>
      {teamId && <StartRecordBtn />}
      <BottomNav />
    </Container>
  );
};

export default RootNavLayout;
