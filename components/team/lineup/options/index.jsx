import { useSelector } from "react-redux";
import MemberInfo from "@/components/team/members/info";
import LineupConfig from "@/components/team/lineup/options/config";
import Substitutes from "@/components/team/lineup/options/substitutes";
import Positions from "@/components/team/lineup/options/positions";

const LineupOptions = ({ team, members, className }) => {
  const { lineups, status } = useSelector((state) => state.lineups);
  const { optionMode, editingMember } = status;
  const { starting, liberos, substitutes } = lineups[status.lineupNum];
  const listedIds = new Set([
    ...starting.map((player) => player._id),
    ...liberos.map((player) => player._id),
    ...substitutes.map((player) => player._id),
  ]);
  const others = members
    .filter((member) => !listedIds.has(member._id))
    .sort((a, b) => a.number - b.number);

  return (
    <>
      {optionMode === "playerInfo" ? (
        <MemberInfo
          teamId={team._id}
          memberId={editingMember._id}
          className={className}
        />
      ) : optionMode === "substitutes" || optionMode === "others" ? (
        <Substitutes members={members} others={others} className={className} />
      ) : optionMode === "positions" ? (
        <Positions className={className} />
      ) : (
        <LineupConfig members={members} others={others} className={className} />
      )}
    </>
  );
};

export default LineupOptions;
