import { useSelector } from "react-redux";
import MemberInfo from "@/components/team/members/info";
import LineupConfig from "@/components/team/lineup/options/LineupConfig";
import BenchList from "@/components/team/lineup/options/BenchList";
import PositionList from "@/components/team/lineup/options/PositionList";

const LineupOptions = () => {
  const { members, editingLineup } = useSelector((state) => state.team);
  const { optionMode, editingMember } = editingLineup.status;
  const member = members.find((m) => m._id === editingMember._id);

  return (
    <>
      {optionMode === "playerInfo" ? (
        <MemberInfo member={member} />
      ) : optionMode === "substitutes" || optionMode === "others" ? (
        <BenchList />
      ) : optionMode === "positions" ? (
        <PositionList />
      ) : (
        <LineupConfig />
      )}
    </>
  );
};

export default LineupOptions;
