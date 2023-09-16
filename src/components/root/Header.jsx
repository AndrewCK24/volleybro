import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import { FiEdit2 } from "react-icons/fi";
import { IoNotificationsSharp } from "react-icons/io5";

const Container = styled.header`
  flex: 0 0 4rem;
  width: 100%;
  padding: 2.5% 5% 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  svg {
    color: var(--color-secondary-500);
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const BtnContainer = styled.div`
  flex: 1 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const StyledLink = styled(Link)`
  flex: 0 0 10rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  border-radius: 0.5rem;
  background-color: var(--color-primary-500);
  color: var(--color-secondary-100);
  font-size: 1.5rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  svg {
    color: var(--color-secondary-100);
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Header = () => {
  return (
    <Container>
      <BtnContainer>
        <StyledLink to="/record">
          <FiEdit2 />
          比賽紀錄
        </StyledLink>
      </BtnContainer>
      <IoNotificationsSharp />
    </Container>
  );
};

export default Header;
