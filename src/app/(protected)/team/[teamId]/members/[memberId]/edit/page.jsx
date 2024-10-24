import InfoForm from "@/components/team/members/info-form";

const EditMemberPage = async (props) => {
  const params = await props.params;
  const { teamId, memberId } = params;

  return <InfoForm teamId={teamId} memberId={memberId} className="w-full" />;
};

export default EditMemberPage;
