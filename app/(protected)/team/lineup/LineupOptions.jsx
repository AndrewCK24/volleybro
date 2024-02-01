import { useSelector } from "react-redux";
import { SectionHr } from "@/app/components/common/Section";
import SubstituteList from "./SubstituteList";
import OtherList from "./OtherList";
import PositionList from "./PositionList";

const LineupOptions = () => {
  const { members, editingLineup } = useSelector((state) => state.team);
  const { starting, substitutes, others, status } = editingLineup;
  const { editingZone, editingMember } = status;

  return (
    <>
      {!(editingZone !== null && editingMember._id) ? (
        <>
          <SubstituteList
            members={members}
            substitutes={substitutes}
            status={status}
          />
          <SectionHr content="以上為正式比賽 12 + 2 人名單" />
          <OtherList members={members} others={others} status={status} />
        </>
      ) : (
        <PositionList starting={starting} status={status} />
      )}
    </>
  );
};

export default LineupOptions;
