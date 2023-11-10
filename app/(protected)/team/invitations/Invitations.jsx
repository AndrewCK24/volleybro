import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { FiPlus } from "react-icons/fi";
import { Section, SectionHr } from "@/app/components/common/Section";
import {
  ListHeader,
  ListTitle,
  ListItem,
  ListItemText,
} from "@/app/components/common/List";

const Invitations = () => {
  const router = useRouter();
  const invitingTeams = useSelector((state) => state.user.teams.inviting);
  const handleCreateTeam = () => router.push("/team/new");

  return (
    <Section>
      <ListHeader>
        <ListTitle>隊伍邀請</ListTitle>
      </ListHeader>
      {invitingTeams.map((team) => (
        <ListItem key={team._id}>
          <ListItemText>{team.name}</ListItemText>
        </ListItem>
      ))}
      <SectionHr content="沒有找到你的隊伍嗎？你可以..." />
      <ListItem type="primary" onClick={handleCreateTeam}>
        <FiPlus />
        建立隊伍
      </ListItem>
    </Section>
  );
};

export default Invitations;
