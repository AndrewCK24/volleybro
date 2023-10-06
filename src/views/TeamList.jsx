import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import store from "../store";
import { userActions } from "../components/user/user-slice";
import { teamActions } from "../components/team/team-slice";
import {
  ListContainer,
  ListHeader,
  ListTitle,
  ListItemContainer,
  ListItemContentContainer,
} from "../components/common/List";
import { IconButton } from "../components/common/Button";
import { FiChevronRight } from "react-icons/fi";

const TeamListPage = () => {
  const dispatch = useDispatch();
  const { teams, invitingTeams } = useSelector((state) => state.user);

  const fetchTeamData = async (teamId) => {
    console.log("teamId", teamId)
    const response = await fetch("/.netlify/functions/fetch-team-by-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ teamId }),
    });
    const { status, userData, teamData } = await response.json();
    if (status === 200) {
      dispatch(userActions.loadUserData(userData));
      dispatch(teamActions.loadTeamData(teamData));
    }
  };

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListTitle>已加入的隊伍</ListTitle>
        </ListHeader>
        {teams.map((team, index) => (
          <ListItemContainer key={team._id}>
            <ListItemContentContainer>{team.name}</ListItemContentContainer>
            {index === 0 || (
              // <IconButton>
              <IconButton onClick={() => fetchTeamData(team._id)} >
                <FiChevronRight />
              </IconButton>
            )}
          </ListItemContainer>
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
