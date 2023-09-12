import { useSelector } from "react-redux";

import { Title } from "./Team";
import MemberCard from "../components/team/MemberCard";
import NewMemberBtn from "../components/team/NewMemberBtn";

const TeamMembersPage = () => {
  const { name, members } = useSelector((state) => state.team);
  // const members = useSelector((state) => state.team.members);

  return (
    <>
      <Title>{name} | Team Members</Title>
      {members.map((member, index) => (
        <MemberCard key={index} index={index} member={member} />
      ))}
      {members[members.length - 1]?.isNew || <NewMemberBtn />}
    </>
  );
};

export default TeamMembersPage;
