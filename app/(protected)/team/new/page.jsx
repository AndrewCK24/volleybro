"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userActions } from "@/app/(protected)/user/user-slice";
import { teamActions } from "@/app/(protected)/team/team-slice";
import { Card } from "@/components/ui/card";
import TeamForm from "../TeamForm";

const NewTeamPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (formData) => {
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const { userData, teamData, membersData } = await res.json();
      dispatch(userActions.setUser(userData));
      dispatch(teamActions.setTeam({ userData, teamData, membersData }));
      return router.push(`/team`);
    } catch (err) {
      console.log(err);
      // TODO: 改為彈出式警告
      // return form.setError("name", { message: "發生未知錯誤，請稍後再試" });
    }
  };

  return (
    <Card className="w-full">
      <TeamForm onSubmit={onSubmit} />
    </Card>
  );
};

export default NewTeamPage;
