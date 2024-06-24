import MatchConfirmation from "@/components/record/info/confirmation";

const NewRecordPage = ({ searchParams }) => {
  const { team: teamId } = searchParams;

  return (
    <MatchConfirmation teamId={teamId} className="w-full overflow-scroll" />
  );
};

export default NewRecordPage;
