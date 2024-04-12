import { useSelector } from "react-redux";
import {
  CourtContainer,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "@/app/components/common/Court";

const ConfirmCourt = () => {
  const { sets, status } = useSelector((state) => state.match);
  const { setNum } = status.editingData;
  const { starters, liberos } = sets[setNum].lineup.ours;
  const { members } = useSelector((state) => state.team);

  return (
    <>
      <CourtContainer>
        <Outside className="left">
          <AdjustButton />
          {liberos.map((libero, index) => {
            const member = members.find((m) => m._id === libero.starting);
            return (
              <PlayerCard key={index}>
                <h3>{member.number || ""}</h3>
                <span>{libero.position || ""}</span>
              </PlayerCard>
            );
          })}
        </Outside>
        <Inside>
          {starters.map((starter, index) => {
            const member = members.find((m) => m._id === starter.starting);
            return (
              <PlayerCard key={index} style={{ gridArea: `z${index + 1}` }}>
                <h3>{member.number || ""}</h3>
                <span>{starter.position || ""}</span>
              </PlayerCard>
            );
          })}
        </Inside>
        <Outside className="right" />
      </CourtContainer>
    </>
  );
};

export default ConfirmCourt;
