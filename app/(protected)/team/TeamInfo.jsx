"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../user/user-slice";
import { teamActions } from "../team/team-slice";
import { FiFileText, FiCheck, FiX, FiEdit2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardBtnGroup } from "@/components/ui/card";
import { ListItem, ListItemText } from "@/app/components/common/List";

const TeamInfo = ({ teamData }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const invitingTeams = useSelector((state) => state.user.teams.inviting);
  const isInviting =
    invitingTeams.find((team) => team === teamData._id) ||
    invitingTeams.find((team) => team._id === teamData._id);
  const isDefaultTeamAdmin = useSelector((state) => state.team.admin);
  const isAdmin =
    teamData._id === useSelector((state) => state.team._id)
      ? isDefaultTeamAdmin
      : false;

  const handleAccept = async (teamId, accept) => {
    if (!window.confirm(accept ? "確認接受邀請？" : "確認拒絕邀請？")) return;
    try {
      const response = await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, accept }),
      });
      if (accept) {
        const { userData, teamData, membersData } = await response.json();
        dispatch(userActions.setUser(userData));
        dispatch(teamActions.setTeam({ userData, teamData, membersData }));
        router.push("/team");
      } else {
        const { userData } = await response.json();
        dispatch(userActions.setUser(userData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>
          <FiFileText />
          隊伍資訊
        </CardTitle>
        <CardBtnGroup>
          {isAdmin && (
            <Button
              variant="link"
              size="lg"
              onClick={() => router.push(`/team/info/${teamData._id}/edit`)}
            >
              <FiEdit2 />
              編輯隊伍
            </Button>
          )}
        </CardBtnGroup>
      </CardHeader>
      <ListItem type="secondary" text>
        <ListItemText fit>隊伍名稱</ListItemText>
        <ListItemText bold>{teamData.name}</ListItemText>
      </ListItem>
      <ListItem type="secondary" text>
        <ListItemText fit>隊伍簡稱</ListItemText>
        <ListItemText bold>{teamData.nickname}</ListItemText>
      </ListItem>
      <ListItem type="secondary" text>
        <ListItemText fit>隊伍人數</ListItemText>
        <ListItemText bold>{teamData.members.length}</ListItemText>
      </ListItem>
      {isInviting && (
        <>
          <p>是否接受此隊伍邀請？</p>
          <Button size="lg" onClick={() => handleAccept(teamData._id, true)}>
            <FiCheck />
            同意邀請
          </Button>
          <Button
            variant="destructive"
            size="lg"
            onClick={() => handleAccept(teamData._id, false)}
          >
            <FiX />
            拒絕邀請
          </Button>
        </>
      )}
    </>
  );
};

export default TeamInfo;
