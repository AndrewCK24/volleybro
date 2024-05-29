"use client";
import { useRouter } from "next/navigation";
import { useTeamMembers } from "@/hooks/use-data";
import MemberForm from "@/components/team/members/form";

const EditMemberPage = ({ params }) => {
  const router = useRouter();
  const { teamId, memberId } = params;
  const { members, mutate } = useTeamMembers(teamId);
  const member = members?.find((member) => member._id === memberId) || {};

  const onSubmit = async (formData) => {
    formData.team_id = teamId;
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const member = await res.json();
      const memberIndex = members.findIndex(
        (member) => member._id === memberId
      );
      members[memberIndex] = member;
      mutate([...members], false);
      return router.push(`/team/${teamId}/members/${memberId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return <MemberForm member={member} onSubmit={onSubmit} className="w-full" />;
};

export default EditMemberPage;
