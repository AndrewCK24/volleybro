import MatchConfirmation from "@/components/record/info/confirmation";

const NewRecordPage = async (props: {
  params: Promise<{ teamId: string }>;
}) => {
  const params = await props.params;
  const { teamId } = params;

  return <MatchConfirmation teamId={teamId} />;
};

export default NewRecordPage;
