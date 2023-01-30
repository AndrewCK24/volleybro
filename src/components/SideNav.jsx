import React from "react";
import styled from "@emotion/styled";

import { ReactComponent as HomePageIcon } from '.././images/logo-black.svg';
import { ReactComponent as RecordPageIcon } from '.././images/play-circle.svg';
import { ReactComponent as TeamPageIcon } from '.././images/users.svg';
import { ReactComponent as HistoryPageIcon } from '.././images/clock.svg';
import { ReactComponent as SettingPageIcon } from '.././images/settings.svg';

// border flex flex-col items-center w-28 h-full absolute
const NavBar = styled.aside`
  width: 6rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  svg {
    height: 5rem;
    width: 5rem;
  }
`;

const IconContainer = styled.div`
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  svg {
    height: 3rem;
    width: 3rem;
  }
`;

const SideNav = () => {
  return (
    <NavBar>
      <HomePageIcon />
      <IconContainer>
        <RecordPageIcon />
        <TeamPageIcon />
        <HistoryPageIcon />
        <SettingPageIcon />
      </IconContainer>
    </NavBar>
  );
};

export default SideNav;