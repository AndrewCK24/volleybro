import { FiSave, FiX } from "react-icons/fi";

import { Section, InnerSection } from "@/app/components/common/Section";
import { ListItem, ListItemContainer } from "@/app/components/common/List";
import BenchList from "./BenchList";
import PositionList from "./PositionList";

const LineupOptions = ({
  members,
  editingLineup,
  editingZone,
  editingMember,
  setEditingZone,
  setEditingMember,
  handleSave,
  handleCancel,
}) => {
  const { starters, benches, edited } = editingLineup;
  const isStarterFilled = starters.every((starter) => starter.member_id);

  return (
    <>
      <Section type="fixed">
        <InnerSection>
          {!isStarterFilled && (
            <ListItem type="danger" text>
              先發滿 6 位才能儲存陣容及紀錄比賽
            </ListItem>
          )}
          {!(editingZone && editingMember._id) ? (
            <BenchList
              members={members}
              benches={benches}
              editingZone={editingZone}
              editingMember={editingMember}
              setEditingMember={setEditingMember}
            />
          ) : (
            <PositionList
              starters={starters}
              editingZone={editingZone}
              editingMember={editingMember}
              setEditingZone={setEditingZone}
              setEditingMember={setEditingMember}
            />
          )}
        </InnerSection>
        <ListItemContainer>
          <ListItem type="secondary" text center onClick={handleCancel}>
            <FiX />
            取消編輯
          </ListItem>
          <ListItem
            type={
              !edited || editingZone || !isStarterFilled
                ? "secondary"
                : "primary"
            }
            center
            disabled={!edited || editingZone || !isStarterFilled}
            onClick={handleSave}
          >
            <FiSave />
            儲存陣容
          </ListItem>
        </ListItemContainer>
      </Section>
    </>
  );
};

export default LineupOptions;
