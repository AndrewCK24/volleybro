"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { useToast } from "@/components/ui/use-toast";
import { useGame } from "@/hooks/use-data";
import { showErrorToast } from "@/lib/api/error-toast";
import { createSubstitution } from "@/lib/features/game/actions/create-substitution";
import { gameActions } from "@/lib/features/game/game-slice";
import { createSubstitutionHelper } from "@/lib/features/game/helpers";
import { useSubstitutes } from "@/lib/features/game/hooks/use-substitutes";
import type { ReduxGameState } from "@/lib/features/game/types";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { cn } from "@/lib/utils";
import { RiArrowLeftSLine, RiCheckLine } from "react-icons/ri";

export const Substitutes = ({
  gameId,
  mode,
  className,
}: {
  gameId: string;
  mode: ReduxGameState["mode"];
  className?: string;
}) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { game, mutate } = useGame(gameId);
  const { setIndex } = useAppSelector((state) => state.game);
  const { status, entryDraft: draft } = useAppSelector(
    (state) => state.game[mode],
  );
  const { entryIndex } = status;
  const substitutes = useSubstitutes(gameId, {
    setIndex,
    entryIndex,
    entryDraft: draft,
  });

  const onSubmit = async () => {
    try {
      // A new substitution gets a fresh identity generated here, before the
      // optimistic update below applies it; editing reuses the id
      // setEditingEntryStatus already loaded onto the draft.
      const entry = {
        ...draft.substitution!,
        id: draft.id || crypto.randomUUID(),
        seq: entryIndex,
      };
      // Advances the draft the instant the write starts, without waiting for
      // the server; awaiting afterwards is what routes a rejection into the
      // catch below rather than leaving it unhandled.
      const write = mutate(
        createSubstitution({ gameId, setIndex, entryIndex }, entry, game!),
        {
          revalidate: false,
          optimisticData: createSubstitutionHelper(
            { gameId, setIndex, entryIndex },
            entry,
            game!,
          ),
        },
      );
      dispatch(gameActions.confirmEntryDraftSubstitution());
      await write;
    } catch (error) {
      showErrorToast(error, toast);
    }
  };

  return (
    <Card className={cn("w-full flex-1 pb-4", className)}>
      <CardHeader>
        <CardTitle>
          <Button
            variant="glass"
            size="icon"
            onClick={() => dispatch(gameActions.resetEntryDraftSubstitution())}
          >
            <RiArrowLeftSLine />
          </Button>
          選擇替補球員
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {substitutes.map((substitute) => {
          const toggled = draft?.substitution?.players?.in === substitute.id;
          return (
            <Item
              key={substitute.id}
              asChild
              variant={toggled ? "primary" : "outline"}
            >
              <button
                type="button"
                aria-pressed={toggled}
                onClick={() =>
                  toggled
                    ? dispatch(gameActions.resetEntryDraftSubstitution())
                    : dispatch(
                        gameActions.setEntryDraftSubstitution(substitute.id),
                      )
                }
              >
                <ItemMedia className="basis-8 justify-end text-xl font-semibold">
                  {substitute.number}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="text-xl">{substitute.name}</ItemTitle>
                </ItemContent>
              </button>
            </Item>
          );
        })}
      </CardContent>
      <Button size="lg" className="text-xl" onClick={onSubmit}>
        <RiCheckLine />
        確認
      </Button>
    </Card>
  );
};
