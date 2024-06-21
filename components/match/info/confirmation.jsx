"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { useDispatch, useSelector } from "react-redux";
import { useTeam, useTeamMembers } from "@/hooks/use-data";
import { FiInfo, FiChevronRight, FiFileText } from "react-icons/fi";
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
import MatchInfoForm from "@/components/match/info/info-form";
import MatchMiscForm from "@/components/match/info/misc-form";
import LoadingCard from "@/components/custom/loading/card";
import { matchActions } from "@/app/store/match-slice";
import { phase, division, category } from "@/lib/text/match";

const MatchConfirmation = ({ teamId }) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const dispatch = useDispatch();
  const [lineupNum, setLineupNum] = useState(0);
  const { info } = useSelector((state) => state.match);
  const { team, isLoading: isTeamLoading } = useTeam(teamId);
  const { members, isLoading: isMembersLoading } = useTeamMembers(teamId);

  const onFormSave = async (formData) => {
    dispatch(matchActions.setMatchInfo(formData));
  };

  const onSubmit = async () => {
    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          
        }),
      });

      const match = await res.json();
      mutate(`/api/matches/${match._id}`, match, false);
      return router.push(`/match/${match._id}?tab=about`);
    } catch (err) {
      console.log(err);
    }
  };

  if (isTeamLoading || isMembersLoading)
    return <LoadingCard className="w-full" />;

  return (
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
        <MatchInfoForm
          team={team}
          members={members}
          onSubmit={onFormSave}
          size="full"
        />
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Description startIcon={<FiFileText />} endIcon={<FiChevronRight />}>
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
        <MatchMiscForm
          team={team}
          members={members}
          onSubmit={onFormSave}
          size="full"
        />
      </Dialog>
      <CardHeader>
        <CardTitle>陣容配置 {lineupNum + 1}</CardTitle>
        <CardBtnGroup>
          {team?.lineups.map((_, index) => (
            <Button
              key={index}
              variant={lineupNum === index ? "" : "outline"}
              size="icon"
              onClick={() => setLineupNum(index)}
              className="text-[1.25rem] w-8 h-8"
            >
              {index + 1}
            </Button>
          ))}
        </CardBtnGroup>
      </CardHeader>
      <Button size="lg" onClick={() => {}}>
        開始比賽
      </Button>
    </Card>
  );
};

export default MatchConfirmation;
