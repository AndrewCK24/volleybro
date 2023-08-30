import { useSelector } from "react-redux";

import MemberCard from "../components/team/MemberCard";
import NewMemberBtn from "../components/team/NewMemberBtn";

const TeamMembersPage = () => {
  const members = useSelector((state) => state.team.members);

  return (
    <>
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
