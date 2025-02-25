import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { lineupActions } from "@/lib/features/team/lineup-slice";
import {
  RiUserFollowLine,
  RiUserLine,
  RiArrowLeftWideLine,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { LineupOptionMode } from "@/lib/features/team/types";

const Substitutes = ({ members, others, className }) => {
  const dispatch = useAppDispatch();
  const { lineups, status } = useAppSelector((state) => state.lineup);
  const liberoCount = lineups[status.lineupIndex].liberos.length;
  const substituteCount = lineups[status.lineupIndex].substitutes.length;
  const substituteLimit = liberoCount < 2 ? 6 - liberoCount : 6;
  const isSubstituteFull = substituteCount >= substituteLimit;
  const isEditingStarting = !!status.editingMember.zone;

  const handleSubstituteClick = (member, index) => {
    if (isEditingStarting) {
      dispatch(
        lineupActions.replaceEditingPlayer({
          _id: member._id,
          list: "substitutes",
          zone: index + 1,
        })
      );
    } else {
      dispatch(lineupActions.removeSubstitutePlayer(member._id));
    }
  };

  const handleOtherClick = (member, index) => {
    if (isEditingStarting) {
      dispatch(
        lineupActions.replaceEditingPlayer({
          _id: member._id,
          list: "",
          zone: index + 1,
        })
      );
    } else if (!isSubstituteFull) {
      dispatch(lineupActions.addSubstitutePlayer(member._id));
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              dispatch(lineupActions.setOptionMode(LineupOptionMode.PLAYERINFO))
            }
          >
            <RiArrowLeftWideLine />
          </Button>
          {`替補名單 (${substituteCount}/${substituteLimit})`}
        </CardTitle>
      </CardHeader>
      {lineups[status.lineupIndex].substitutes.map((player, index) => {
        const member = members.find((m) => m._id === player._id);
        return (
          <Button
            key={member._id}
            variant={isEditingStarting ? "outline" : "default"}
            size="wide"
            onClick={() => handleSubstituteClick(member, index)}
            className="text-xl"
          >
            <RiUserFollowLine />
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
            <RiUserLine />
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
