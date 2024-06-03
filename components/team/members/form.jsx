"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
  email: z
    .string()
    .email({ message: "請輸入有效的 email" })
    .optional()
    .or(z.literal("")),
  admin: z.coerce.boolean().optional(),
});

const MemberForm = ({ member, onSubmit, className }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || "",
      number: member?.number || "",
      email: member?.meta?.email || "",
      admin: member?.meta?.admin ? "true" : "false",
    },
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>編輯隊員資訊</CardTitle>
      </CardHeader>
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
                <FormRadioItem variant="destructive" value="false" id="member">
                  一般成員
                </FormRadioItem>
                <FormRadioItem variant="destructive" value="true" id="admin">
                  管理者
                </FormRadioItem>
              </FormRadioGroup>
              <FormControl></FormControl>
              <FormDescription>是否有權限變更隊伍與隊員資訊</FormDescription>
            </FormItem>
          )}
        />
        <Button size="lg">{member ? "儲存變更" : "新增隊員"}</Button>
      </Form>
    </Card>
  );
};

export default MemberForm;
