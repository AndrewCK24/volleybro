import MemberForm from "@/components/team/members/form";

const MemberCreatePage = ({ params }) => {
  const { teamId } = params;

  return <MemberForm teamId={teamId} className="w-full" />;
};

export default MemberCreatePage;
