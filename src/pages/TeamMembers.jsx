import { useSelector } from "react-redux";

import { Title } from "./Team";
import MemberCard from "../components/team/MemberCard";
import NewMemberBtn from "../components/team/NewMemberBtn";

const TeamMembersPage = () => {
  const members = useSelector((state) => state.team.members);

  return (
    <>
      <Title>Team Members</Title>
      {members.map((member, index) => (
        <MemberCard key={index} index={index} member={member} />
      ))}
      <NewMemberBtn
      // disabled={members.slice(-1)[0]?.isNew}
      />
    </>
  );
};

export default TeamMembersPage;
