import { useSelector } from "react-redux";
import {
  Court,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "@/components/custom/Court";

const ConfirmCourt = () => {
  const { sets, status, recording } = useSelector((state) => state.match);
  const { setNum } = status.editingData;
  const { starting, liberos } = sets[setNum].lineup.ours;
  const { members } = useSelector((state) => state.team);

  return (
    <>
      <Court>
        <Outside className="left">
          <AdjustButton />
          {liberos.map((libero, index) => {
            const member = members.find((m) => m._id === libero.starting);
            return (
              <PlayerCard
                key={index}
                member={member}
                list="liberos"
                zone={index + 1}
                onCardClick={() =>
                  dispatch(
                    teamActions.setRecordingPlayer({
                      _id: member?._id || null,
                      list: "liberos",
                      zone: index + 1,
                    })
                  )
                }
                editingMember={recording}
              />
            );
          })}
        </Outside>
        <Inside>
          {starting.map((starting, index) => {
            const member = members.find((m) => m._id === starting.starting);
            return (
              <PlayerCard
                key={index}
                member={member}
                list="starting"
                zone={index + 1}
                onCardClick={() =>
                  dispatch(
                    teamActions.setRecordingPlayer({
                      _id: member?._id || null,
                      list: "starting",
                      zone: index + 1,
                    })
                  )
                }
                onSwitchClick={() =>
                  dispatch(teamActions.setOptionMode("substitutes"))
                }
                onCrossClick={() => dispatch(teamActions.removeEditingPlayer())}
                editingMember={recording}
              />
            );
          })}
        </Inside>
      </Court>
    </>
  );
};

export default ConfirmCourt;
