import MatchConfirmation from "@/components/match/info/confirmation";

const NewMatchPage = ({ searchParams }) => {
  const { team: teamId } = searchParams;

  return (
    <MatchConfirmation teamId={teamId} className="w-full overflow-scroll" />
  );
};

export default NewMatchPage;
