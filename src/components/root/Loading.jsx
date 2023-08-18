import styled from "@emotion/styled";

import Logo from "../general/Logo";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loading = () => {
  return (
    <Container>
      <Logo />
    </Container>
  );
};

export default Loading;
