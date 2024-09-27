"use client";
import { useTeam } from "@/src/hooks/use-data";
import { useRouter } from "next/navigation";
import TeamForm from "@/src/components/team/form";

const EditTeamPage = ({ params }) => {
  const router = useRouter();
  const { teamId } = params;
  const { team, mutate } = useTeam(teamId);

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const teamData = await res.json();
      mutate({ ...team, ...teamData }, false);
      return router.push(`/team/${teamId}?tab=about`);
    } catch (error) {
      console.error(error);
      // TODO: 改為彈出式警告
    }
  };

  return <TeamForm team={team} onSubmit={onSubmit} className="w-full" />;
};

export default EditTeamPage;
