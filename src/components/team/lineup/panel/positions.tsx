"use client";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { PanelContent } from "@/components/custom/panel";
import { Position } from "@/entities/team";
import { lineupActions } from "@/lib/features/team/lineup-slice";
import { LineupOptionMode } from "@/lib/features/team/types";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RiArrowLeftSLine } from "react-icons/ri";

export const positions = [
  {
    text: "舉球 (二傳, Setter)",
    value: Position.S,
  },
  {
    text: "主攻 (大砲, Outside Hitter)",
    value: Position.OH,
  },
  {
    text: "快攻 (攔中, Middle Blocker)",
    value: Position.MB,
  },
  {
    text: "副攻 (舉對, Opposite Hitter)",
    value: Position.OP,
  },
  {
    text: "自由 (Libero)",
    value: Position.L,
  },
];

export const Positions = () => {
  const dispatch = useAppDispatch();
  const { lineups, status } = useAppSelector((state) => state.lineup);
  const { list, zone } = status.editingMember;
  const activeList = (list || "starting") as
    "starting" | "liberos" | "substitutes";
  const toggledPosition =
    zone != null
      ? lineups[status.lineupIndex]?.[activeList][zone - 1]?.position
      : undefined;
  const isEditingLiberos = list === "liberos";

  return (
    <PanelContent>
      <CardHeader className="w-full flex-row items-center justify-start">
        <Button
          variant="glass"
          size="icon"
          onClick={() =>
            dispatch(lineupActions.setOptionMode(LineupOptionMode.PLAYERINFO))
          }
        >
          <RiArrowLeftSLine />
        </Button>
        <CardTitle>選擇位置</CardTitle>
      </CardHeader>
      {positions.map((position) => {
        const toggled =
          toggledPosition != null && toggledPosition === position.value;
        return (
          <Item
            key={position.value}
            asChild
            variant={toggled ? "primary" : "outline"}
          >
            <button
              type="button"
              aria-pressed={toggled}
              onClick={() =>
                dispatch(lineupActions.setPlayerPosition(position.value))
              }
              disabled={
                position.value === "L" ? !isEditingLiberos : isEditingLiberos
              }
            >
              <ItemMedia className="basis-8 justify-end text-xl font-semibold">
                {position.value}
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-xl">{position.text}</ItemTitle>
              </ItemContent>
            </button>
          </Item>
        );
      })}
    </PanelContent>
  );
};
