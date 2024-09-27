import { useDispatch, useSelector } from "react-redux";
import { lineupsActions } from "@/src/app/store/lineups-slice";
import { FiUserCheck, FiUser, FiChevronLeft } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";

const Substitutes = ({ members, others, className }) => {
  const dispatch = useDispatch();
  const { lineups, status } = useSelector((state) => state.lineups);
  const liberoCount = lineups[status.lineupNum].liberos.length;
  const substituteCount = lineups[status.lineupNum].substitutes.length;
  const substituteLimit = liberoCount < 2 ? 6 - liberoCount : 6;
  const isSubstituteFull = substituteCount >= substituteLimit;
  const isEditingStarting = !!status.editingMember.zone;

  const handleSubstituteClick = (member, index) => {
    if (isEditingStarting) {
      dispatch(
        lineupsActions.replaceEditingPlayer({
          _id: member._id,
          list: "substitutes",
          zone: index + 1,
        })
      );
    } else {
      dispatch(lineupsActions.removeSubstitutePlayer(member._id));
    }
  };

  const handleOtherClick = (member, index) => {
    if (isEditingStarting) {
      dispatch(
        lineupsActions.replaceEditingPlayer({
          _id: member._id,
          list: "",
          zone: index + 1,
        })
      );
    } else if (!isSubstituteFull) {
      dispatch(lineupsActions.addSubstitutePlayer(member._id));
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(lineupsActions.setOptionMode(""))}
        >
          <FiChevronLeft />
        </Button>
        <CardTitle>{`替補名單 (${substituteCount}/${substituteLimit})`}</CardTitle>
      </CardHeader>
      {lineups[status.lineupNum].substitutes.map((player, index) => {
        const member = members.find((m) => m._id === player._id);
        return (
          <Button
            key={member._id}
            variant={isEditingStarting ? "outline" : "default"}
            size="wide"
            onClick={() => handleSubstituteClick(member, index)}
            className="text-xl"
          >
            <FiUserCheck />
            <span className="flex justify-end font-semibold basis-8">
              {member.number || " "}
            </span>
            {member.name}
          </Button>
        );
      })}
      <Separator content="以上為正式比賽 12 + 2 人名單" />
      {others.map((member, index) => {
        return (
          <Button
            key={member._id}
            variant="outline"
            size="wide"
            onClick={() => handleOtherClick(member, index)}
            className="text-xl"
          >
            <FiUser />
            <span className="flex justify-end font-semibold basis-8">
              {member.number}
            </span>
            {member.name}
          </Button>
        );
      })}
    </Card>
  );
};

export default Substitutes;
