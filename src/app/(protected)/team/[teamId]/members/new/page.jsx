import MemberForm from "@/components/team/members/form";

const MemberCreatePage = async (props) => {
  const params = await props.params;
  const { teamId } = params;

  return <MemberForm teamId={teamId} className="w-full" />;
};

export default MemberCreatePage;
