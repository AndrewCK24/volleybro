import { useSelector } from "react-redux";
import { InnerSection } from "@/app/components/common/Section";
import { ListItem, ListItemContainer } from "@/app/components/common/List";
import BenchList from "./BenchList";
import PositionList from "./PositionList";

const LineupOptions = () => {
  const { members, editingLineup } = useSelector((state) => state.team);
  const { starters, benches, status } = editingLineup;
  const { editingZone, editingMember } = status;
  const isStarterFilled = starters.every((starter) => starter.member_id);

  return (
    <>
      <InnerSection>
        {!isStarterFilled && (
          <ListItem type="danger" text>
            先發滿 6 位才能儲存陣容及紀錄比賽
          </ListItem>
        )}
        {!(editingZone && editingMember._id) ? (
          <BenchList members={members} benches={benches} status={status} />
        ) : (
          <PositionList starters={starters} status={status} />
        )}
      </InnerSection>
    </>
  );
};

export default LineupOptions;
