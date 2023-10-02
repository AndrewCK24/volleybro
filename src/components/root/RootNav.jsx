import { useEffect } from "react";
import { Container, PagesContainer } from "../../pages/Root";
import { useSelector } from "react-redux";
import { useLocation, Outlet } from "react-router-dom";

import Header from "./Header";
import BottomNav from "./BottomNav";
import StartRecordBtn from "./StartRecordBtn";

const RootNavLayout = () => {
  const teamId = useSelector((state) => state.team._id);
  const { title } = useSelector((state) => state.root);
  const { pathname } = useLocation();
  const pathArr = pathname.split("/").filter(Boolean);
  const index = pathArr.length > 1 ? `/${pathArr[0]}` : "";

  useEffect(() => {
    document.title = title ? `${title} | V-Stats` : "V-Stats";
  }, [title]);

  return (
    <Container>
      <Header title={title} index={index}></Header>
      <PagesContainer>
        <Outlet />
      </PagesContainer>
      {teamId && <StartRecordBtn />}
      <BottomNav />
    </Container>
  );
};

export default RootNavLayout;
