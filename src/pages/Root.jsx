import { Suspense } from "react";
import { Await, Outlet } from "react-router-dom";
import styled from "@emotion/styled";

import Loading from "../components/root/Loading";
import SideNav from "../components/root/SideNav";

const Container = styled.div`
  background-color: var(--color-primary-100);
  width: 100vw;
  height: 100vh;
  max-height: -webkit-fill-available;
  display: flex;
  /* flex-direction: row; */
  flex-direction: column-reverse;
  flex-wrap: nowrap;
`;

const PagesContainer = styled.main`
  flex: 1 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  overflow: hidden;
  height: 100%;
  padding: 1rem;
  /* padding: 5% 0.5rem; */
`;

const RootLayout = () => {
  return (
    <Container>
      <Suspense fallback={<Loading />}>
        <Await>
          <SideNav />
          <PagesContainer>
            <Outlet />
          </PagesContainer>
        </Await>
      </Suspense>
    </Container>
  );
};

export default RootLayout;
