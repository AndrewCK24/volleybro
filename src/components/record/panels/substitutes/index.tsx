"use client";
import { useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRecord } from "@/hooks/use-data";
import { FiChevronLeft, FiCheck } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createSubstitution } from "@/lib/features/record/actions/create-substitution";
import { createSubstitutionOptimistic } from "@/lib/features/record/helpers";

import { Side } from "@/entities/record";
import type { ReduxRecordState } from "@/lib/features/record/types";
import type { RecordActions } from "@/lib/features/record/record-slice";
import type { EditingActions } from "@/lib/features/record/editing-slice";

const Substitutes = ({
  recordId,
  recordState,
  recordActions,
}: {
  recordId: string;
  recordState: ReduxRecordState;
  recordActions: RecordActions | EditingActions;
}) => {
  const dispatch = useAppDispatch();
  const { record, mutate } = useRecord(recordId);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const {
    status: { setIndex, rallyIndex },
    recording,
  } = recordState;
  const players = record.teams.home.players;
  const lineup = record.sets[setIndex].lineups.home;
  const recordingPlayer =
    lineup.starting.find((p) => p._id === recording.home.player._id) ||
    lineup.liberos.find((p) => p._id === recording.home.player._id);
  const substitutes = lineup.substitutes.map((sub) =>
    players.find((player) => player._id === sub._id)
  );

  const onSubmit = async () => {
    const substitution = {
      team: Side.HOME,
      rallyIndex: rallyIndex - 1,
      players: {
        in: selectedPlayer,
        out: recordingPlayer._id,
      },
    };
    try {
      mutate(
        createSubstitution(
          { recordId, setIndex, rallyIndex: rallyIndex - 1 },
          substitution,
          record
        ),
        {
          revalidate: false,
          optimisticData: createSubstitutionOptimistic(
            { recordId, setIndex, rallyIndex: rallyIndex - 1 },
            substitution,
            record
          ),
        }
      );
      dispatch(recordActions.resetRecording());
      setSelectedPlayer(null);
    } catch (error) {
      console.error("[POST /api/records/sets/substitution]", error);
    }
  };

  return (
    <Card className="flex-1 w-full">
      <CardHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(recordActions.setRecordingMode("home"))}
        >
          <FiChevronLeft />
        </Button>
        <CardTitle>選擇替補球員</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {substitutes.map((substitute) => {
          const toggled = selectedPlayer === substitute._id;
          return (
            <Button
              key={substitute._id}
              variant={toggled ? "default" : "outline"}
              size="wide"
              className="text-xl"
              onClick={() => setSelectedPlayer(toggled ? null : substitute._id)}
            >
              <span className="flex justify-end font-semibold basis-8">
                {substitute.number}
              </span>
              {substitute.name}
            </Button>
          );
        })}
      </CardContent>
      <Button size="lg" className="text-xl" onClick={onSubmit}>
        <FiCheck />
        確認
      </Button>
    </Card>
  );
};

export default Substitutes;
