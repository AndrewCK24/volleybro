"use client";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import TeamForm from "@/src/components/team/form";

const NewTeamPage = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const onSubmit = async (formData) => {
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const team = await res.json();
      mutate(`/api/teams/${team._id}`, team, false);
      return router.push(`/team/${team._id}?tab=about`);
    } catch (err) {
      console.log(err);
      // TODO: 改為彈出式警告
      // return form.setError("name", { message: "發生未知錯誤，請稍後再試" });
    }
  };

  return <TeamForm onSubmit={onSubmit} className="w-full" />;
};

export default NewTeamPage;
