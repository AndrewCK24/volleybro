"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTeam } from "@/hooks/use-data";
import { FiSave, FiUser, FiShield } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

const formSchema = z.object({
  role: z.enum(["owner", "admin", "member"]),
});

const RoleForm = ({ teamId, memberId }) => {
  const { team, mutate } = useTeam(teamId);
  const member = team?.members?.find((member) => member._id === memberId);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: member?.role || "member",
    },
  });

  const onSubmit = async (formData) => {
    try {
      const res = await fetch(
        `/api/teams/${teamId}/members?memberId=${memberId}&action=access`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const members = await res.json();
      mutate({ ...team, members }, false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>權限</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="選擇權限" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="member">
                  <FiUser />
                  一般成員
                </SelectItem>
                <SelectItem value="admin">
                  <FiShield />
                  管理者
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>管理者有權限變更隊伍與成員資訊，以及權限設定</FormDescription>
          </FormItem>
        )}
      />
      <Button type="submit" variant="destructive" size="lg">
        <FiSave />
        儲存權限設定
      </Button>
    </Form>
  );
};

export default RoleForm;
