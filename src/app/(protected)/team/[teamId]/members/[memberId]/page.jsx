import MembersInfo from "@/src/components/team/members/info";

const MemberPage = ({ params }) => {
  const { teamId, memberId } = params;

  return <MembersInfo teamId={teamId} memberId={memberId} className="w-full" />;
};

export default MemberPage;
