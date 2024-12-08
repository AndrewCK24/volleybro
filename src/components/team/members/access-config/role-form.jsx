"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useTeam } from "@/hooks/use-data";
import { RiSaveLine, RiUserLine, RiAdminLine } from "react-icons/ri";
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
  role: z.coerce.number().min(0).max(2), // TODO: use Role enum from "@/entities/team"
});

const RoleForm = ({ teamId, memberId }) => {
  const { toast } = useToast();
  const { team, mutate } = useTeam(teamId);
  const member = team?.members?.find((member) => member._id === memberId);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: member?.role || 0,
    },
  });

  const onSubmit = async (formData) => {
    if (formData.role === member.role) {
      return toast({
        title: "權限未變更",
        description: "已設定此成員為此權限",
      });
    }

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
      return toast({
        title: "權限已變更",
        description: "成員的權限已變更",
      });
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
                <SelectItem value="0">
                  <RiUserLine />
                  一般成員
                </SelectItem>
                <SelectItem value="2">
                  <RiAdminLine />
                  管理者
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              管理者有權限變更隊伍與成員資訊，以及權限設定
            </FormDescription>
          </FormItem>
        )}
      />
      <Button type="submit" variant="destructive" size="lg">
        <RiSaveLine />
        儲存權限設定
      </Button>
    </Form>
  );
};

export default RoleForm;
