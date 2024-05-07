"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userActions } from "@/app/(protected)/user/user-slice";
import { teamActions } from "@/app/(protected)/team/team-slice";
import { Button, Link } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardBtnGroup,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    email: z.string().email({ message: "請輸入有效的 email" }),
    password: z.string().min(6, { message: "請輸入長度 6-20 密碼" }),
  })
  .required();

const SignInForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (formData) => {
    try {
      const res = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 404)
        return form.setError("email", { message: "帳號不存在" });
      if (res.status === 401)
        return form.setError("password", { message: "密碼錯誤" });

      if (res.status === 200) {
        const { userData, teamData, membersData } = await res.json();
        dispatch(userActions.setUser(userData));
        if (teamData) {
          dispatch(teamActions.setTeam({ userData, teamData, membersData }));
          return router.push("/");
        } else {
          return router.push("/team/invitations");
        }
      }
    } catch (err) {
      setEmailError("發生未知錯誤，請稍後再試");
      console.log(err);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>歡迎使用 V-Stats</CardTitle>
      </CardHeader>
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input placeholder="v-stats@example.com" {...field} />
              </FormControl>
              <FormDescription>請輸入有效的 email</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>密碼</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>請輸入長度 6-20 密碼</FormDescription>
            </FormItem>
          )}
        />
        <CardBtnGroup>
          <Link variant="link" size="xs" href="/auth/password">
            忘記密碼？
          </Link>
        </CardBtnGroup>
        <Button size="lg">登入</Button>
      </Form>
      <Separator content="或使用以下方式登入" />
      <Link variant="outline" size="lg" href="/sign-up">
        註冊
      </Link>
      <CardFooter />
    </>
  );
};

export default SignInForm;
