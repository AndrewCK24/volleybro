import { useAppDispatch } from "@/lib/redux/hooks";
import { useLineup } from "@/lib/features/record/hooks/use-lineup";
import {
  Court,
  Outside,
  Inside,
  PlayerCard,
  SubIndicator,
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
  const { starting, liberos } = useLineup(recordId, recordState);
  const { status, recording } = recordState;

  if (status.inPlay === false) {
    return (
      <Court>
        <Outside className="inner">
          {Array.from({ length: 3 }).map((_, index) => (
            <PlaceholderCard key={index} />
          ))}
        </Outside>
        <Inside>
          {Array.from({ length: 6 }).map((_, index) => (
            <PlaceholderCard key={index} />
          ))}
        </Inside>
      </Court>
    );
  }

  return (
    <Court>
      <Outside className="inner">
        <AdjustButton />
        {liberos.map((player, index) => (
          <PlayerCard
            key={index}
            player={player}
            list="liberos"
            zone={-(index + 1)}
            onClick={() =>
              dispatch(
                recordActions.setRecordingPlayer({
                  _id: player._id,
                  zone: -(index + 1),
                })
              )
            }
            editingMember={{
              ...recording.home.player,
              list: recording.home.player.zone > 0 ? "starting" : "liberos",
            }}
          >
            {player.sub?._id && <SubIndicator number={player.sub.number} />}
          </PlayerCard>
        ))}
      </Outside>
      <Inside>
        {starting.map((player, index) => (
          <PlayerCard
            key={index}
            player={player}
            list="starting"
            zone={index + 1}
            onClick={() =>
              dispatch(
                recordActions.setRecordingPlayer({
                  _id: player._id,
                  zone: index + 1,
                })
              )
            }
            editingMember={{
              ...recording.home.player,
              list: recording.home.player.zone > 0 ? "starting" : "liberos",
            }}
          >
            {player.sub?._id && <SubIndicator number={player.sub.number} />}
          </PlayerCard>
        ))}
      </Inside>
    </Court>
  );
};

export default RecordCourt;
