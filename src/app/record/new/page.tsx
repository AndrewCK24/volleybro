import { FiArrowLeft } from "react-icons/fi";
import { Link } from "@/components/ui/button";
import MatchConfirmation from "@/components/record/info/confirmation";

const NewRecordPage = async (props: {
  searchParams: Promise<{ team: string }>;
}) => {
  const searchParams = await props.searchParams;
  const { team: teamId } = searchParams;

  return (
    <>
      <header className="w-full h-12 px-[5%] flex flex-row items-center justify-center gap-4 overscroll-none bg-primary-foreground shadow-md">
        <Link
          href={`/team/${teamId}`}
          variant="ghost"
          size="icon"
          className="[&>svg]:w-8 [&>svg]:h-8"
        >
          <FiArrowLeft />
        </Link>
        <h1 className="flex-1 text-[1.625rem] font-medium text-center m-0 pr-10">
          新增比賽紀錄
        </h1>
      </header>
      <MatchConfirmation teamId={teamId} />
    </>
  );
};

export default NewRecordPage;
