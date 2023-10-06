import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

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
import { FiChevronRight, FiCheck, FiX } from "react-icons/fi";

const TeamListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teams, invitingTeams } = useSelector((state) => state.user);

  const switchTeam = async (teamId) => {
    try {
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
        navigate("/team");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInvitation = async (teamId, accept) => {
    try {
      const response = await fetch(
        "/.netlify/functions/update-team-invitation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({ teamId, accept }),
        }
      );
      const { status, userData } = await response.json();
      if (status === 200) {
        if (accept) {
          dispatch(userActions.loadUserData(userData));
        } else {
          dispatch(userActions.loadUserData(userData));
        }
      }
    } catch (error) {
      console.log(error);
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
              <IconButton onClick={() => switchTeam(team._id)}>
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
            <ListItemContentContainer>
              {invitingTeam.name}
            </ListItemContentContainer>
            <IconButton
              onClick={() => handleInvitation(invitingTeam._id, true)}
            >
              <FiCheck />
            </IconButton>
            <IconButton
              className="danger"
              onClick={() => handleInvitation(invitingTeam._id, false)}
            >
              <FiX />
            </IconButton>
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
