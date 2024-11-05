import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { recordActions } from "@/lib/features/record/record-slice";
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

const RecordCourt = ({ recordId }: { recordId: string }) => {
  const dispatch = useAppDispatch();
  const recordState = useAppSelector((state) => state.record);
  const { status, recording } = recordState[recordState.mode];
  const { starting, liberos } = useLineup(recordId, recordState);

  if (status.inProgress === false) {
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
