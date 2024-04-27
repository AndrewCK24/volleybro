"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "@/app/(protected)/team/team-slice";
import { Card } from "@/components/ui/card";
import TeamForm from "../../../TeamForm";

const EditTeamPage = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id: teamId } = params;
  const teamData = useSelector((state) => state.team);

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const { teamData } = await res.json();
      dispatch(teamActions.updateTeamOnly(teamData));
      return router.push(`/team/info/${teamId}`);
    } catch (error) {
      console.error(error);
      // TODO: 改為彈出式警告
      // return form.setError("name", { message: "發生未知錯誤，請稍後再試" });
    }
  };

  return (
    <Card className="w-full">
      <TeamForm teamData={teamData} onSubmit={onSubmit} />
    </Card>
  );
};

export default EditTeamPage;
