import { useSelector } from "react-redux";
import { InnerSection } from "@/app/components/common/Section";
import SubstituteList from "./SubstituteList";
import PositionList from "./PositionList";

const LineupOptions = () => {
  const { members, editingLineup } = useSelector((state) => state.team);
  const { starting, substitutes, status } = editingLineup;
  const { editingZone, editingMember } = status;

  return (
    <>
      <InnerSection>
        {!(editingZone && editingMember._id) ? (
          <SubstituteList
            members={members}
            substitutes={substitutes}
            status={status}
          />
        ) : (
          <PositionList starting={starting} status={status} />
        )}
      </InnerSection>
    </>
  );
};

export default LineupOptions;
