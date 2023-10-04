import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import store from "../store";
import {
  ListContainer,
  ListHeader,
  ListTitle,
  ListItemContainer,
} from "../components/common/List";

const TeamListPage = () => {
  const { teams, invitingTeams } = useSelector((state) => state.user);

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListTitle>已加入的隊伍</ListTitle>
        </ListHeader>
        {teams.map((team) => (
          <ListItemContainer key={team._id}>{team.name}</ListItemContainer>
        ))}
      </ListContainer>
      <ListContainer>
        <ListHeader>
          <ListTitle>已受邀的隊伍</ListTitle>
        </ListHeader>
        {invitingTeams.map((invitingTeam) => (
          <ListItemContainer key={invitingTeam._id}>
            {invitingTeam.name}
          </ListItemContainer>
        ))}
      </ListContainer>
      <div />
      <div>沒看到正在尋找的隊伍嗎？</div>
      <div>
        請聯絡隊伍管理者，或是<Link to="/team/new">按此新增隊伍</Link>。
      </div>
    </>
  );
};

export default TeamListPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "隊伍列表" });
  return null;
};
