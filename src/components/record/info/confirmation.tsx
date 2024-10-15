"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { useTeam, useTeamMembers } from "@/hooks/use-data";
import {
  FiInfo,
  FiChevronRight,
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBtnGroup,
} from "@/components/ui/card";
import {
  Description,
  DescriptionTitle,
  DescriptionContent,
} from "@/components/ui/description";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import MatchInfoForm from "@/components/record/info/info-form";
import MatchMiscForm from "@/components/record/info/misc-form";
import RosterTable from "@/components/record/info/roster-table";
import LoadingCard from "@/components/custom/loading/card";
import { phase, division, category } from "@/lib/text/match";

import { type FormMatch } from "@/lib/features/record/types";

const MatchConfirmation = ({ teamId }: { teamId: string }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { team, isLoading: isTeamLoading } = useTeam(teamId);
  const { members, isLoading: isMembersLoading } = useTeamMembers(teamId);

  const [lineupNum, setLineupNum] = useState(0);
  const [info, setInfo] = useState<FormMatch>({
    // _id: "",
    name: "",
    number: null,
    phase: "0",
    division: "0",
    category: "0",
    scoring: {
      setCount: "3",
      decidingSetPoints: 15,
    },
    location: {
      city: "",
      hall: "",
    },
    time: {
      date: "",
      start: "",
      end: "",
    },
    weather: {
      temperature: "",
    },
  });

  const getPlayerData = (list: string) => {
    if (!team || !members) return [];
    return team.lineups[lineupNum][list].map((player) => {
      const member = members.find((member) => member._id === player._id);
      return {
        _id: member._id,
        name: member.name,
        number: member.number,
        list,
      };
    });
  };
  const starting = getPlayerData("starting");
  const liberos = getPlayerData("liberos");
  const substitutes = getPlayerData("substitutes");
  const players = starting
    .concat(liberos, substitutes)
    .sort((a, b) => a.number - b.number);

  const createRecord = async () => {
    const infoData = {
      ...info,
      phase: Number(info.phase),
      division: Number(info.division),
      category: Number(info.category),
      scoring: {
        ...info.scoring,
        setCount: Number(info.scoring.setCount),
      },
    };

    try {
      const res = await fetch(`/api/records?ti=${teamId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          info: infoData,
          team: {
            _id: teamId,
            name: team.name,
            players,
          },
          lineup: team.lineups[lineupNum],
        }),
      });

      const record = await res.json();
      if (record.error) throw new Error(record.error);
      mutate(`/api/records/${record._id}`, record, false);
      return router.push(`/record/${record._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  if (isTeamLoading || isMembersLoading)
    return <LoadingCard className="w-full" />;

  return (
    <>
      <Card className="w-full overflow-scroll">
        <CardHeader>
          <CardTitle>確認資訊</CardTitle>
        </CardHeader>
        <Dialog>
          <DialogTrigger asChild>
            <Description startIcon={<FiInfo />} endIcon={<FiChevronRight />}>
              <DescriptionTitle>{info.name || "賽事資訊"}</DescriptionTitle>
              <DescriptionContent>
                場次{info.number || "未設定"}
                {phase[info.phase]}
                {phase[info.phase] && " "}
                {division[info.division]} {category[info.category]}
              </DescriptionContent>
            </Description>
          </DialogTrigger>
          <MatchInfoForm info={info} setInfo={setInfo} />
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Description
              startIcon={<FiFileText />}
              endIcon={<FiChevronRight />}
            >
              <DescriptionTitle>時間與地點</DescriptionTitle>
              <DescriptionContent>
                {info.location.city}
                {info.location.city && " "}
                {info.location.hall}
                {info.location.hall && " "}
                {info.time.date}
                {info.time.date && " "}
                {info.time.start}
                {(info.time.start || info.time.end) && "-"}
                {info.time.end}
              </DescriptionContent>
            </Description>
          </DialogTrigger>
          <MatchMiscForm info={info} setInfo={setInfo} />
        </Dialog>
        <CardHeader>
          <CardTitle>陣容配置 {lineupNum + 1}</CardTitle>
          <CardBtnGroup>
            {team?.lineups.map((_, index) => (
              <Button
                key={index}
                variant={lineupNum === index ? "default" : "outline"}
                size="icon"
                onClick={() => setLineupNum(index)}
                className="text-[1.25rem] w-8 h-8"
              >
                {index + 1}
              </Button>
            ))}
          </CardBtnGroup>
        </CardHeader>
        <RosterTable roster={players} />
      </Card>
      <div className="flex flex-col w-full px-4 pb-4">
        <Button size="lg" onClick={createRecord}>
          開始比賽
          <FiArrowRight />
        </Button>
      </div>
    </>
  );
};

export default MatchConfirmation;
