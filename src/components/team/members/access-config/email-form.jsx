"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useTeam } from "@/hooks/use-data";
import { RiSendPlaneLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "請輸入有效的 email" })
    .optional()
    .or(z.literal("")),
});

const EmailForm = ({ teamId, memberId }) => {
  const { toast } = useToast();
  const { team, mutate } = useTeam(teamId);
  const member = team?.members?.find((member) => member._id === memberId);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: member?.email || "",
    },
  });

  const onSubmit = async (formData) => {
    const isEmailNotChanged = formData.email === member?.email;
    if (isEmailNotChanged) {
      return toast({
        title: "email 未變更",
        description: "已邀請此 email 加入隊伍",
      });
    }

    const hasSameEmail = team.members.some((m) => m?.email === formData.email);
    if (hasSameEmail) {
      form.setError("email", {
        message: "已在其他成員邀請中使用此 email",
      });
      return toast({
        title: "email 已存在",
        description: "已在其他成員邀請中使用此 email",
        variant: "destructive",
      });
    }

    try {
      const res = await fetch(
        `/api/teams/${teamId}/members?memberId=${memberId}&action=invite`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const members = await res.json();
      mutate({ ...team, members }, false);

      if (!formData.email) return toast({ title: "已移除 email" });

      return toast({
        title: "邀請已發送",
        description: "受邀者將在以此 email 註冊之帳號收到邀請",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
      {/* TODO: 顯示已接受要請之使用者 */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>電子郵件</FormLabel>
            <FormControl>
              <Input placeholder="volleybro@example.com" {...field} />
            </FormControl>
            <FormDescription>
              受邀者將在以此 email 註冊之帳號收到邀請
            </FormDescription>
          </FormItem>
        )}
      />
      <Button type="submit" variant="destructive" size="lg">
        <RiSendPlaneLine />
        發送隊伍邀請
      </Button>
    </Form>
  );
};

export default EmailForm;
