import React from "react";
import tw from 'twin.macro';

import { ReactComponent as HomePageIcon } from '.././images/logo-black.svg';
import { ReactComponent as RecordPageIcon } from '.././images/play-circle.svg';
import { ReactComponent as TeamPageIcon } from '.././images/users.svg';
import { ReactComponent as HistoryPageIcon } from '.././images/clock.svg';
import { ReactComponent as SettingPageIcon } from '.././images/settings.svg';

const NavBar = tw.aside`border flex flex-col justify-center w-28 h-full absolute`;

const SideNav = () => {
  return (
    <NavBar>
      <HomePageIcon />
      <RecordPageIcon />
      <TeamPageIcon />
      <HistoryPageIcon />
      <SettingPageIcon />
    </NavBar>
  );
};

export default SideNav;