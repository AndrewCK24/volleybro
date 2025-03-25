import { useRouter } from "next/navigation";
import { RiGroupLine, RiArrowRightWideLine } from "react-icons/ri";
import { Card } from "@/components/ui/card";
import type { MatchResult } from "@/entities/record";

export const Result = ({ match }: { match: MatchResult }) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/record/${match._id}`)}
      className="flex flex-col gap-2 px-4 py-2 bg-card md:flex-row"
    >
      <div className="flex flex-row items-center justify-center grow-0 gap-2 md:flex-col">
        <p className="flex-1">{match.info.name || "no title"}</p>
        <p>{match.info.time.date || "no date"}</p>
      </div>
      <div className="flex-1 text-xl">
        <TeamInfo team={match.teams.home} isHome />
        <TeamInfo team={match.teams.away} isHome={false} />
      </div>
      <div className="flex flex-row items-center justify-end text-muted-foreground">
        查看比賽
        <RiArrowRightWideLine />
      </div>
    </Card>
  );
};

const TeamInfo = ({
  team,
  isHome,
}: {
  team: MatchResult["teams"]["home"];
  isHome: boolean;
}) => {
  return (
    <div className="flex flex-row items-center justify-start">
      <p className="flex flex-row items-center flex-1 gap-2">
        <RiGroupLine />
        {isHome ? team.name || "我方" : team.name || "對手"}
      </p>
      <div className="flex flex-row items-center gap-2 flex-0">
        <p className="text-3xl font-medium">{team.sets}</p>
        {team.scores.map(
          (score, index) =>
            score && (
              <p
                key={index}
                className="flex items-center justify-center w-4 text-lg"
              >
                {score}
              </p>
            )
        )}
      </div>
    </div>
  );
};
