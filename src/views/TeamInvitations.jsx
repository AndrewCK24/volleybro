import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import store from "../store";
import { userActions } from "../components/user/user-slice";
import { teamActions } from "../components/team/team-slice";
import {
  List,
  ListHeader,
  ListInfo,
  ListTitle,
  ListItem,
  ListItemContent,
} from "../components/common/List";
import { IconButton } from "../components/common/Button";
import { FiCheck, FiX } from "react-icons/fi";

const TeamInvitationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invitingTeams } = useSelector((state) => state.user);


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
      <List>
        <ListHeader>
          <ListInfo>
            <ListTitle>已受邀的隊伍</ListTitle>
          </ListInfo>
        </ListHeader>
        {invitingTeams.map((invitingTeam) => (
          <ListItem key={invitingTeam._id}>
            <ListItemContent className="extend">
              {invitingTeam.name}
            </ListItemContent>
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
          </ListItem>
        ))}
      </List>
      <div />
      <div>沒看到正在尋找的隊伍嗎？</div>
      <div>
        請聯絡隊伍管理者，或是<Link to="/team/new">按此新增隊伍</Link>。
      </div>
    </>
  );
};

export default TeamInvitationsPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "隊伍邀請" });
  return null;
};
