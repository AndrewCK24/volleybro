import React from 'react';
import styled from '@emotion/styled';

import SideNav from './components/SideNav';
import RecordPage from './pages/RecordPage';

const Container = styled.div`
  background-color: var(--white-primary);
  height: 100vh;
  width: 100vw;
  display: flex;
`;

const PagesContainer = styled.main`
  height: 100%;
  width: 100%;
  padding-top: 5vh;
  padding-bottom: 5vh;
`;

const App = () => {
  return (
    <Container>
      <SideNav />
      <PagesContainer>
        <RecordPage />
      </PagesContainer>
    </Container>
  )
};

export default App;