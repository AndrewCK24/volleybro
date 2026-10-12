"use client";
import { PanelContent } from "@/components/custom/panel";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { useGame } from "@/hooks/use-data";
import { lineupActions } from "@/lib/features/team/lineup-slice";
import { LineupOptionMode } from "@/lib/features/team/types";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RiArrowLeftSLine, RiUserFollowLine } from "react-icons/ri";

export const Substitutes = ({ gameId }: { gameId: string }) => {
  const dispatch = useAppDispatch();
  const { game } = useGame(gameId);
  const { lineups, status } = useAppSelector((state) => state.lineup);
  const members = game?.teams.home.players ?? [];

  return (
    <PanelContent>
      <Card className="size-full p-0">
        <CardHeader className="flex-row items-center justify-start">
          <Button
            variant="glass"
            size="icon"
            onClick={() =>
              dispatch(lineupActions.setOptionMode(LineupOptionMode.NONE))
            }
          >
            <RiArrowLeftSLine />
          </Button>
          <CardTitle>替補名單</CardTitle>
        </CardHeader>
        {lineups[status.lineupIndex]?.substitutes.map((player, index) => {
          const member = members.find((m) => m.id === player.id);
          if (!member) return null;
          return (
            <Item key={member.id} asChild variant="outline">
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    lineupActions.replaceEditingPlayer({
                      id: member.id,
                      list: "substitutes",
                      zone: index + 1,
                    }),
                  )
                }
              >
                <ItemMedia>
                  <RiUserFollowLine className="size-6" />
                </ItemMedia>
                <ItemMedia className="basis-8 justify-end text-xl font-semibold">
                  {member.number || " "}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="text-xl">{member.name}</ItemTitle>
                </ItemContent>
              </button>
            </Item>
          );
        })}
      </Card>
    </PanelContent>
  );
};
