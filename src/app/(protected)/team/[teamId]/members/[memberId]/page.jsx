import MembersInfo from "@/components/team/members/info";

const MemberPage = async (props) => {
  const params = await props.params;
  const { teamId, memberId } = params;

  return <MembersInfo teamId={teamId} memberId={memberId} className="w-full" />;
};

export default MemberPage;
