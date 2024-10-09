import { useAppDispatch } from "@/lib/redux/hooks";
import { useRecord } from "@/hooks/use-data";
import {
  Court,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
  PlaceholderCard,
} from "@/components/custom/court";
import type { ReduxRecordState } from "@/lib/features/record/types";
import type { RecordActions } from "@/lib/features/record/record-slice";
import type { EditingActions } from "@/lib/features/record/editing-slice";

const RecordCourt = ({
  recordId,
  recordState,
  recordActions,
}: {
  recordId: string;
  recordState: ReduxRecordState;
  recordActions: RecordActions | EditingActions;
}) => {
  const dispatch = useAppDispatch();
  const { record } = useRecord(recordId);
  const { status, recording, lineups } = recordState;
  const members = record.teams.home.players;

  if (status.inPlay === false) {
    return (
      <Court>
        <Outside className="inner">
          <PlaceholderCard />
          <PlaceholderCard />
          <PlaceholderCard />
        </Outside>
        <Inside>
          <PlaceholderCard />
          <PlaceholderCard />
          <PlaceholderCard />
          <PlaceholderCard />
          <PlaceholderCard />
          <PlaceholderCard />
        </Inside>
      </Court>
    );
  }

  return (
    <Court>
      <Outside className="inner">
        <AdjustButton />
        {lineups.home.liberos.map((libero, index) => {
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
              editingMember={recording.home.player}
            />
          );
        })}
      </Outside>
      <Inside>
        {lineups.home.starting.map((starting, index) => {
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
              editingMember={recording.home.player}
            />
          );
        })}
      </Inside>
    </Court>
  );
};

export default RecordCourt;
