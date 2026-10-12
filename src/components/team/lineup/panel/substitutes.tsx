"use client";
import { PanelContent } from "@/components/custom/panel";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { lineupActions } from "@/lib/features/team/lineup-slice";
import { LineupOptionMode, type PlayerView } from "@/lib/features/team/types";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RiArrowLeftSLine, RiUserFollowLine, RiUserLine } from "react-icons/ri";

interface SubstitutesProps {
  players: PlayerView[];
  others: PlayerView[];
}

export const Substitutes = ({ players, others }: SubstitutesProps) => {
  const dispatch = useAppDispatch();
  const { lineups, status } = useAppSelector((state) => state.lineup);
  const lineup = lineups[status.lineupIndex];
  const liberoCount = lineup?.liberos.length ?? 0;
  const substituteCount = lineup?.substitutes.length ?? 0;
  const substituteLimit = liberoCount < 2 ? 6 - liberoCount : 6;
  const isSubstituteFull = substituteCount >= substituteLimit;
  const isEditingStarting = !!status.editingMember.zone;

  const handleSubstituteClick = (player: PlayerView, index: number) => {
    if (isEditingStarting) {
      dispatch(
        lineupActions.replaceEditingPlayer({
          id: player.id,
          list: "substitutes",
          zone: index + 1,
        }),
      );
    } else {
      dispatch(lineupActions.removeSubstitutePlayer(player.id));
    }
  };

  const handleOtherClick = (player: PlayerView, index: number) => {
    if (isEditingStarting) {
      dispatch(
        lineupActions.replaceEditingPlayer({
          id: player.id,
          list: "",
          zone: index + 1,
        }),
      );
    } else if (!isSubstituteFull) {
      dispatch(lineupActions.addSubstitutePlayer(player.id));
    }
  };

  return (
    <PanelContent>
      <CardHeader className="w-full flex-row items-center justify-start">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            dispatch(lineupActions.setOptionMode(LineupOptionMode.PLAYERINFO))
          }
        >
          <RiArrowLeftSLine />
        </Button>
        <CardTitle>{`替補名單 (${substituteCount}/${substituteLimit})`}</CardTitle>
      </CardHeader>
      {lineup?.substitutes.map((lineupPlayer, index) => {
        const player = players.find((p) => p.id === lineupPlayer.id);
        if (!player) return null;
        return (
          <Item
            key={player.id}
            asChild
            variant={isEditingStarting ? "outline" : "primary"}
          >
            <button
              type="button"
              onClick={() => handleSubstituteClick(player, index)}
            >
              <ItemMedia>
                <RiUserFollowLine className="size-6" />
              </ItemMedia>
              <ItemMedia className="basis-8 justify-end text-xl font-semibold">
                {player?.number || " "}
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-xl">{player?.name}</ItemTitle>
              </ItemContent>
            </button>
          </Item>
        );
      })}
      <Separator content="以上為正式比賽 12 + 2 人名單" />
      {others.map((player, index) => {
        return (
          <Item key={player.id} asChild variant="outline">
            <button
              type="button"
              onClick={() => handleOtherClick(player, index)}
            >
              <ItemMedia>
                <RiUserLine className="size-6" />
              </ItemMedia>
              <ItemMedia className="basis-8 justify-end text-xl font-semibold">
                {player?.number}
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-xl">{player?.name}</ItemTitle>
              </ItemContent>
            </button>
          </Item>
        );
      })}
    </PanelContent>
  );
};
