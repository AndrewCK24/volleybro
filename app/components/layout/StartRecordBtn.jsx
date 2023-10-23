import { Link } from "react-router-dom";
import styled from "styled-components";

import { FiEdit } from "react-icons/fi";

const StyledLink = styled(Link)`
  position: absolute;
  bottom: 5rem;
  right: 5%;
  width: 12rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 0.5rem;
  background-color: var(--color-danger-500);
  color: var(--color-primary-100);
  font-size: 1.5rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
  svg {
    color: var(--color-primary-100);
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const StartRecordBtn = () => {
  return (
    <StyledLink to="/record">
      <FiEdit />
      開始紀錄
    </StyledLink>
  );
};

export default StartRecordBtn;
