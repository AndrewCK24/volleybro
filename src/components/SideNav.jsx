import React from "react";
import styled from "@emotion/styled";

import { ReactComponent as HomePageIcon } from '.././images/logo-black.svg';
import { ReactComponent as RecordPageIcon } from '.././images/play-circle.svg';
import { ReactComponent as TeamPageIcon } from '.././images/users.svg';
import { ReactComponent as HistoryPageIcon } from '.././images/clock.svg';
import { ReactComponent as SettingPageIcon } from '.././images/settings.svg';
import { ReactComponent as UserIcon } from '.././images/user.svg';

const NavBar = styled.aside`
  width: 6rem;
  height: 100%;
  padding-top: 5vh;
  padding-bottom: 5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  svg {
    height: 5rem;
    width: 5rem;
  }
`;

const IconContainer = styled.div`
  height: 100%;
  padding-top: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  svg {
    height: 2rem;
    width: 2rem;
    padding-top: 1.5rem;
  }
`;

const UserContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  svg {
    height: 2rem;
    width: 2rem;
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
      <UserContainer>
        <UserIcon />
      </UserContainer>
    </NavBar>
  );
};

export default SideNav;