import { useDispatch, useSelector } from "react-redux";
import { useRecord } from "@/hooks/use-data";
import { recordActions } from "@/app/store/record-slice";
import {
  Court,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "@/components/custom/court";

const RecordCourt = ({ recordId }) => {
  const dispatch = useDispatch();
  const { record } = useRecord(recordId);
  const { status, recording } = useSelector((state) => state.record);
  const members = record.teams.home.players;
  const lineup = record.sets[status.setNum]?.lineups.home;

  return (
    <Court>
      <Outside className="inner">
        <AdjustButton />
        {lineup.liberos.map((libero, index) => {
          const member = members.find((m) => m._id === libero._id);
          const player = {
            ...member,
            position: libero?.position || "",
          };
          return (
            <PlayerCard
              key={index}
              player={player}
              list="liberos"
              zone={index + 1}
              onCardClick={() =>
                dispatch(
                  recordActions.setRecordingPlayer({
                    _id: libero._id,
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
        {lineup.starting.map((starting, index) => {
          const member = members.find((m) => m._id === starting._id);
          const player = {
            ...member,
            position: starting?.position || "",
          };
          return (
            <PlayerCard
              key={index}
              player={player}
              list="starting"
              zone={index + 1}
              onCardClick={() =>
                dispatch(
                  recordActions.setRecordingPlayer({
                    _id: starting._id,
                    list: "starting",
                    zone: index + 1,
                  })
                )
              }
              editingMember={recording}
            />
          );
        })}
      </Inside>
    </Court>
  );
};

export default RecordCourt;
