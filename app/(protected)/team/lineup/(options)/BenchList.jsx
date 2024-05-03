import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "../../team-slice";
import { FiUserCheck, FiUser, FiChevronLeft } from "react-icons/fi";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListItem, ListItemText } from "@/app/components/common/List";
import { Button } from "@/components/ui/button";

const BenchList = () => {
  const dispatch = useDispatch();
  const { members, editingLineup } = useSelector((state) => state.team);
  const liberoCount = editingLineup.liberos.filter(
    (player) => player._id
  ).length;
  const substituteCount = editingLineup.substitutes.length;
  const substituteLimit = liberoCount < 2 ? 6 - liberoCount : 6;
  const isSubstituteFull = substituteCount >= substituteLimit;
  const isEditingStarting = editingLineup.status.optionMode === "substitutes";

  const handleSubstituteClick = (member, index) => {
    if (isEditingStarting) {
      dispatch(
        teamActions.replaceEditingPlayer({
          _id: member._id,
          list: "substitutes",
          zone: index,
        })
      );
    } else {
      dispatch(teamActions.removeSubstitutePlayer(index));
    }
  };

  const handleOtherClick = (member, index) => {
    if (isEditingStarting) {
      dispatch(
        teamActions.replaceEditingPlayer({
          _id: member._id,
          list: "others",
          zone: index,
        })
      );
    } else if (!isSubstituteFull) {
      dispatch(teamActions.addSubstitutePlayer(index));
    }
  };

  return (
    <>
      <CardHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(teamActions.setOptionMode(""))}
        >
          <FiChevronLeft />
        </Button>
        <CardTitle>{`替補名單 (${substituteCount}/${substituteLimit})`}</CardTitle>
      </CardHeader>
      {editingLineup.substitutes.map((player, index) => {
        const member = members.find((m) => m._id === player._id);
        return (
          <ListItem
            key={index}
            type={isEditingStarting || "primary"}
            onClick={() => handleSubstituteClick(member, index)}
          >
            <FiUserCheck />
            <ListItemText minimized bold>
              {member.number || " "}
            </ListItemText>
            <ListItemText>{member.name}</ListItemText>
          </ListItem>
        );
      })}
      <Separator />
      <p className="text-center">以上為正式比賽 12 + 2 人名單</p>
      {editingLineup.others.map((player, index) => {
        const member = members.find((m) => m._id === player._id);
        return (
          <ListItem key={index} onClick={() => handleOtherClick(member, index)}>
            <FiUser />
            <ListItemText minimized bold>
              {member.number || " "}
            </ListItemText>
            <ListItemText>{member.name}</ListItemText>
          </ListItem>
        );
      })}
    </>
  );
};

export default BenchList;
