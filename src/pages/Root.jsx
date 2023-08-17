import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";

import SideNav from "../components/root/SideNav";

const Container = styled.div`
  background-color: var(--white-primary);
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const PagesContainer = styled.main`
  flex: 1 1;
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
  padding-top: 5%;
  padding-bottom: 5%;
`;

const RootLayout = () => {
  return (
    <Container>
      <SideNav />
      <PagesContainer>
        <Outlet />
      </PagesContainer>
    </Container>
  );
};

export default RootLayout;
