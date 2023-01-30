import React from 'react';
import styled from '@emotion/styled';

import SideNav from './components/SideNav';
import RecordPage from './components/Pages/RecordPage';

const Container = styled.div`
  background-color: #F5F5F5;
  height: 100vh;
  width: 100vw;
  display: flex;
`;

const PageContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const App = () => {
  return (
    <Container>
      <SideNav />
      <PageContainer>
        <RecordPage />
      </PageContainer>
    </Container>
  )
};

export default App;