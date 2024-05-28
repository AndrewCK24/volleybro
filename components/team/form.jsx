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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "隊伍名稱不得為空" })
      .max(20, { message: "請輸入長度小於 20 的隊伍名稱" }),
    nickname: z.string().max(8, { message: "請輸入長度小於 8 的隊伍簡稱" }),
  })
  .required();

const TeamForm = ({ team, onSubmit, className }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team?.name || "",
      nickname: team?.nickname || "",
    },
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>編輯隊伍資訊</CardTitle>
      </CardHeader>
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>隊伍名稱</FormLabel>
              <FormControl>
                <Input placeholder="日本國家男子排球隊" {...field} />
              </FormControl>
              <FormDescription>請輸入 20 字以內的隊伍全名</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>隊伍簡稱</FormLabel>
              <FormControl>
                <Input placeholder="RYUJIN" {...field} />
              </FormControl>
              <FormDescription>請輸入 8 字以內隊伍簡稱</FormDescription>
            </FormItem>
          )}
        />
        <Button size="lg">{team ? "儲存修改" : "建立隊伍"}</Button>
      </Form>
    </Card>
  );
};

export default TeamForm;
