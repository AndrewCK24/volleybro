import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import store from "../store";
import {
  ListContainer,
  ListHeader,
  ListTitle,
  ListItemContainer,
  ListItem,
} from "../components/common/List";

const TeamListPage = () => {
  const { teams, invitingTeams } = useSelector((state) => state.user);

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListTitle>已加入的隊伍</ListTitle>
        </ListHeader>
        <ListItemContainer>
          {teams.map((team) => (
            <ListItem key={team._id}>{team.name}</ListItem>
          ))}
        </ListItemContainer>
      </ListContainer>
      <ListContainer>
        <ListHeader>
          <ListTitle>已受邀的隊伍</ListTitle>
        </ListHeader>
        <ListItemContainer>
          {invitingTeams.map((invitingTeam) => (
            <ListItem key={invitingTeam._id}>{invitingTeam.name}</ListItem>
          ))}
        </ListItemContainer>
      </ListContainer>
      <div />
      <div>沒看到你的隊伍嗎？</div>
      <div>
        請聯絡你的隊伍管理者，或是<Link to="/team/new">按此新增隊伍</Link>。
      </div>
    </>
  );
};

export default TeamListPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "隊伍列表" });
  return null;
};
