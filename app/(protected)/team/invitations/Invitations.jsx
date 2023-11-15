import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { FiPlus, FiCheck, FiX } from "react-icons/fi";
import { Section, SectionHr } from "@/app/components/common/Section";
import {
  ListHeader,
  ListTitle,
  ListItem,
  ListItemText,
  ListBtn,
} from "@/app/components/common/List";

const Invitations = () => {
  const router = useRouter();
  const invitingTeams = useSelector((state) => state.user.teams.inviting);

  const handleAccept = async (teamId) => {
    // e.preventDefault();
    console.log("accept invitation", teamId);
    try {
      const response = await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      const { userData, teamData, membersData } = await response.json();
      dispatch(userActions.setUser(userData));
      dispatch(teamActions.setTeam({ userData, teamData, membersData }));
      router.push("/team");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateTeam = () => router.push("/team/new");

  return (
    <Section>
      <ListHeader>
        <ListTitle>隊伍邀請</ListTitle>
      </ListHeader>
      {invitingTeams.map((team) => (
        <ListItem key={team._id}>
          <ListItemText>{team.name}</ListItemText>
          <ListBtn type="primary" onClick={() => handleAccept(team._id)} div={true}>
            <FiCheck />
          </ListBtn>
        </ListItem>
      ))}
      <SectionHr content="沒有找到你的隊伍嗎？你可以..." />
      <ListItem type="primary" onClick={handleCreateTeam}>
        <FiPlus />
        建立隊伍
      </ListItem>
      <p>或聯絡你的隊伍管理者</p>
    </Section>
  );
};

export default Invitations;
