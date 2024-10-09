import InfoForm from "@/components/team/members/info-form";

const EditMemberPage = ({ params }) => {
  const { teamId, memberId } = params;

  return <InfoForm teamId={teamId} memberId={memberId} className="w-full" />;
};

export default EditMemberPage;
