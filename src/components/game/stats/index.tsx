"use client";
import { TeamsStats } from "@/components/game/stats/teams-stats";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGame } from "@/hooks/use-data";
import type { SetView } from "@/lib/features/game/types";
import { useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

export const Stats = ({ gameId }: { gameId: string }) => {
  const [setIndex, setSetIndex] = useState(-1);
  const { game } = useGame(gameId);

  return (
    <Card className="w-full">
      <CardHeader>
        <SetPager
          sets={game!.sets}
          setIndex={setIndex}
          setSetIndex={setSetIndex}
        />
      </CardHeader>
      <Tabs defaultValue="team-stats" className="relative w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="team-stats">隊伍數據</TabsTrigger>
          <TabsTrigger value="box-score" disabled>
            個人數據
          </TabsTrigger>
        </TabsList>
        <TabsContent value="team-stats">
          <TeamsStats sets={game!.sets} setIndex={setIndex} />
        </TabsContent>
        <TabsContent value="box-score"></TabsContent>
      </Tabs>
    </Card>
  );
};

export const StatsForOneSet = ({
  gameId,
  setIndex,
}: {
  gameId: string;
  setIndex: number;
}) => {
  const { game } = useGame(gameId);

  return (
    <Card className="w-full">
      <Tabs defaultValue="team-stats" className="relative w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="team-stats">隊伍數據</TabsTrigger>
          <TabsTrigger value="box-score" disabled>
            個人數據
          </TabsTrigger>
        </TabsList>
        <TabsContent value="team-stats">
          <TeamsStats sets={game!.sets} setIndex={setIndex} />
        </TabsContent>
        <TabsContent value="box-score"></TabsContent>
      </Tabs>
    </Card>
  );
};

const SetPager = ({
  sets,
  setIndex,
  setSetIndex,
}: {
  sets: SetView[];
  setIndex: number;
  setSetIndex: (index: number) => void;
}) => {
  const isOverview = setIndex === -1;
  const hasNext = setIndex + 1 < sets.length;

  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center">
      <div className="justify-self-start">
        {!isOverview && (
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground"
            onClick={() => setSetIndex(setIndex === 0 ? -1 : setIndex - 1)}
          >
            <RiArrowLeftSLine />
            {setIndex === 0 ? "總覽" : `第 ${setIndex} 局`}
          </Button>
        )}
      </div>
      <CardTitle aria-live="polite" className="justify-center">
        {isOverview ? "數據總覽" : `第 ${setIndex + 1} 局數據`}
      </CardTitle>
      <div className="justify-self-end">
        {hasNext && (
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground"
            onClick={() => setSetIndex(setIndex + 1)}
          >
            {`第 ${setIndex + 2} 局`}
            <RiArrowRightSLine />
          </Button>
        )}
      </div>
    </div>
  );
};
