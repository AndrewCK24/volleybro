"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRecord } from "@/hooks/use-data";
import { FiChevronLeft, FiCheck } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createSubstitution } from "@/lib/features/record/actions/create-substitution";
import { createSubstitutionOptimistic } from "@/lib/features/record/helpers";

import type { ReduxRecordState } from "@/lib/features/record/types";
import type { RecordActions } from "@/lib/features/record/record-slice";
import type { EditingActions } from "@/lib/features/record/editing-slice";

const Substitutes = ({
  recordId,
  recordState,
  recordActions,
  className,
}: {
  recordId: string;
  recordState: ReduxRecordState;
  recordActions: RecordActions | EditingActions;
  className?: string;
}) => {
  const dispatch = useAppDispatch();
  const { record, mutate } = useRecord(recordId);
  const {
    status: { setIndex, entryIndex },
    recording,
  } = recordState;
  const players = record.teams.home.players;
  const lineup = record.sets[setIndex].lineups.home;
  const substitutes = lineup.substitutes.map((sub) =>
    players.find((player) => player._id === sub._id)
  );

  const onSubmit = async () => {
    try {
      mutate(
        createSubstitution(
          { recordId, setIndex, entryIndex },
          recording.substitution,
          record
        ),
        {
          revalidate: false,
          optimisticData: createSubstitutionOptimistic(
            { recordId, setIndex, entryIndex },
            recording.substitution,
            record
          ),
        }
      );
      dispatch(recordActions.confirmRecordingSubstitution());
    } catch (error) {
      console.error("[POST /api/records/sets/substitution]", error);
    }
  };

  return (
    <Card className={cn("flex-1 w-full", className)}>
      <CardHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(recordActions.resetRecordingSubstitution())}
        >
          <FiChevronLeft />
        </Button>
        <CardTitle>選擇替補球員</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {substitutes.map((substitute) => {
          const toggled =
            recording?.substitution?.players?.in === substitute._id;
          return (
            <Button
              key={substitute._id}
              variant={toggled ? "default" : "outline"}
              size="wide"
              className="text-xl"
              onClick={() =>
                dispatch(
                  recordActions.setRecordingSubstitution(
                    toggled ? null : substitute._id
                  )
                )
              }
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
