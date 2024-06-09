"use client";
import { useRouter } from "next/navigation";
import { useTeamMembers } from "@/hooks/use-data";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiSave } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingCard from "@/components/custom/loading/card";

const formSchema = z.object({
  name: z.string().min(1, { message: "姓名不得為空" }),
  number: z.coerce
    .number()
    .min(1, { message: "背號不得為空或小於 1" })
    .max(99, { message: "背號不得大於 99" }),
});

const MemberInfoForm = ({ member, onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || "",
      number: member?.number || "",
    },
  });

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>姓名</FormLabel>
            <FormControl>
              <Input placeholder="石川祐希" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="number"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>背號</FormLabel>
            <FormControl>
              <Input
                placeholder="14"
                type="number"
                inputMode="numeric"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <Button size="lg">
        <FiSave />
        儲存成員資訊
      </Button>
    </Form>
  );
};

const InfoForm = ({ teamId, memberId, className }) => {
  const router = useRouter();
  const { members, mutate } = useTeamMembers(teamId);
  const member = members?.find((member) => member._id === memberId) || {};

  const onSubmit = async (formData) => {
    formData.team_id = teamId;
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const member = await res.json();
      const memberIndex = members.findIndex((m) => m._id === memberId);
      members[memberIndex] = member;
      mutate([...members], false);
      return router.push(`/team/${teamId}/members/${memberId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!members) return <LoadingCard className={className} />;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>基本資訊</CardTitle>
      </CardHeader>
      <MemberInfoForm member={member} onSubmit={onSubmit} />
    </Card>
  );
};

export default InfoForm;
