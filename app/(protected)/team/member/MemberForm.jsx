"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "../team-slice";
import { Button, Link } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormRadioGroup,
  FormRadioItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1, { message: "姓名不得為空" }),
  number: z.coerce
    .number()
    .min(1, { message: "背號不得為空或小於 1" })
    .max(99, { message: "背號不得大於 99" }),
  position: z.string().optional(),
  email: z
    .string()
    .email({ message: "請輸入有效的 email" })
    .optional()
    .or(z.literal("")),
  admin: z.coerce.boolean().optional(),
});

const MemberForm = ({ member = null, setIsEditing }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { _id: teamId, admin: isAdmin } = useSelector((state) => state.team);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || "",
      number: member?.number || "",
      position: member?.position || "",
      email: member?.meta.email || "",
      admin: member?.meta.admin ? "true" : "false",
    },
  });

  const onSubmit = async (formData) => {
    formData.team_id = teamId;
    formData._id = member?._id;
    const isEditing = member;

    try {
      const response = await fetch("/api/members", {
        method: isEditing ? "PUT" : "POST", // PUT for update, POST for create
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const { teamData, membersData, member } = await response.json();

      dispatch(teamActions.setTeam({ userData: user, teamData, membersData }));
      if (isEditing) {
        setIsEditing(false);
      } else {
        router.push(`/team/member/${member._id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
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
              <FormDescription>請輸入隊員姓名</FormDescription>
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
                <Input placeholder="14" type="number" {...field} />
              </FormControl>
              <FormDescription>請輸入背號</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>位置</FormLabel>
              <FormRadioGroup className="grid-cols-2" {...field}>
                <FormRadioItem variant="destructive" value="S" id="S">
                  舉球 (S)
                </FormRadioItem>
                <FormRadioItem variant="destructive" value="OH" id="OH">
                  主攻 (OH)
                </FormRadioItem>
                <FormRadioItem variant="destructive" value="MB" id="MB">
                  攔中 (MB)
                </FormRadioItem>
                <FormRadioItem variant="destructive" value="OP" id="OP">
                  副攻 (OP)
                </FormRadioItem>
                <FormRadioItem variant="destructive" value="L" id="L">
                  自由 (L)
                </FormRadioItem>
              </FormRadioGroup>
            </FormItem>
          )}
        />
        {isAdmin && (
          <>
            <Separator />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>信箱</FormLabel>
                  <FormControl>
                    <Input placeholder="yukivb@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>請輸入信箱</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="admin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>權限</FormLabel>
                  <FormRadioGroup className="grid-cols-2" {...field}>
                    <FormRadioItem
                      variant="destructive"
                      value="false"
                      id="member"
                    >
                      一般成員
                    </FormRadioItem>
                    <FormRadioItem
                      variant="destructive"
                      value="true"
                      id="admin"
                    >
                      管理者
                    </FormRadioItem>
                  </FormRadioGroup>
                  <FormControl></FormControl>
                  <FormDescription>
                    是否有權限變更隊伍與隊員資訊
                  </FormDescription>
                </FormItem>
              )}
            />
          </>
        )}
        <Button size="lg">{member ? "儲存變更" : "新增隊員"}</Button>
      </Form>
      {member ? (
        <Button variant="outline" size="lg" onClick={() => setIsEditing(false)}>
          取消編輯
        </Button>
      ) : (
        <Link variant="outline" size="lg" href="/team">
          取消新增
        </Link>
      )}
    </>
  );
};

export default MemberForm;
