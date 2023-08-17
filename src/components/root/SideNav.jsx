import styled from "@emotion/styled";

import { ReactComponent as HomePageIcon } from '../../images/logo-black.svg';
import { ReactComponent as RecordPageIcon } from '../../images/play-circle.svg';
import { ReactComponent as TeamPageIcon } from '../../images/users.svg';
import { ReactComponent as HistoryPageIcon } from '../../images/clock.svg';
import { ReactComponent as SettingPageIcon } from '../../images/settings.svg';
import { ReactComponent as UserIcon } from '../../images/user.svg';

const Container = styled.aside`
  flex: 0 0 4rem;
  height: 100%;
  padding-top: 5%;
  padding-bottom: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  svg {
    height: 2rem;
    width: 2rem;
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
    <Container>
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
    </Container>
  );
};

export default SideNav;