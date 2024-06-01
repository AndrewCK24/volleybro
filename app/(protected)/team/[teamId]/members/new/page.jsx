"use client";
import { useRouter } from "next/navigation";
import { useTeamMembers } from "@/hooks/use-data";
import MemberForm from "@/components/team/members/form";

const MemberCreatePage = ({ params }) => {
  const router = useRouter();
  const { teamId } = params;
  const { members, mutate } = useTeamMembers(teamId);

  const onSubmit = async (formData) => {
    formData.team_id = teamId;
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const member = await res.json();
      mutate([...members, member], false);
      return router.push(`/team/${teamId}/members/${member._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return <MemberForm onSubmit={onSubmit} className="w-full" />;
};

export default MemberCreatePage;
