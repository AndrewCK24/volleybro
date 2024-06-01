import { useSelector } from "react-redux";
import MemberInfo from "@/components/team/members/info";
import LineupConfig from "@/components/team/lineup/options/config";
import Substitutes from "@/components/team/lineup/options/substitutes";
import Positions from "@/components/team/lineup/options/positions";

const LineupOptions = ({ team, members, className }) => {
  const { lineups, status } = useSelector((state) => state.lineups);
  const { optionMode, editingMember } = status;
  const member = members?.find((m) => m._id === editingMember._id) || null;

  return (
    <>
      {optionMode === "playerInfo" ? (
        <MemberInfo
          teamId={team._id}
          memberId={editingMember._id}
          className={className}
        />
      ) : optionMode === "substitutes" || optionMode === "others" ? (
        <Substitutes members={members} className={className} />
      ) : optionMode === "positions" ? (
        <Positions className={className} />
      ) : (
        <LineupConfig members={members} className={className} />
      )}
    </>
  );
};

export default LineupOptions;
