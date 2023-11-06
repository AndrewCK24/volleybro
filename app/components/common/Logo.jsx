"use client";
import styled from "styled-components";

const Container = styled.div`
  flex: 0 0;
  width: 100%;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  font-size: 3rem;
  font-weight: 500;
  color: var(--primary-100);
  text-shadow: 0 0 0.5rem var(--primary-100);
  position: relative;
  &.maximized {
    flex: 1 1;
  }

  &::before {
    content: "";
    width: 80vw;
    aspect-ratio: 1;
    border-radius: 2rem;
    background: var(--secondary-500);
    position: absolute;
    z-index: -2;
    rotate: 30deg;
  }

  &::after {
    content: "";
    width: 40vw;
    aspect-ratio: 1;
    border-radius: 2rem;
    background: var(--danger-500);
    position: absolute;
    left: 60%;
    top: 60%;
    z-index: -1;
    rotate: 60deg;
  }
  /* TODO: 加上動畫效果: https://youtu.be/1EAtn4B-76g */
`;

const Logo = ({ className }) => (
  <Container className={className}>V-STATS</Container>
);

export default Logo;
