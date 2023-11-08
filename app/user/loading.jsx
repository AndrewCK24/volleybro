"use client";
import styled from "styled-components";
import { ListItem } from "../components/common/List";

const LoadingItem = styled(ListItem)`
  animation: skeleton 0.75s linear infinite alternate;
  @keyframes skeleton {
    0% {
      background-color: transparent;
    }
    100% {
      background-color: var(--primary-300);
    }
  }
`;

const Loading = () => {
  return (
    <>
      <LoadingItem key={1} />
      <LoadingItem key={2} />
    </>
  );
};

export default Loading;
