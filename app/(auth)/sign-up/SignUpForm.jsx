"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userActions } from "@/app/(protected)/user/user-slice";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
    password: z
      .string()
      .min(6, { message: "請輸入長度 6-20 密碼" })
      .max(20, { message: "請輸入長度 6-20 密碼" }),
    confirm_password: z
      .string()
      .min(6, { message: "請輸入長度 6-20 密碼" })
      .max(20, { message: "請輸入長度 6-20 密碼" }),
    name: z
      .string()
      .min(1, { message: "請輸入姓名" })
      .max(20, { message: "姓名不得超過20字" }),
  })
  .required()
  .refine((data) => data.password === data.confirm_password, {
    message: "密碼不一致",
    path: ["confirm_password"],
  });

const SignUpForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      name: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 409) return setEmailError("帳號已存在");
      if (res.status === 400) return setConfirmPasswordError("密碼不一致");

      if (res.status === 201) {
        const { userData } = await res.json();
        dispatch(userActions.setUser(userData));
        const response = await fetch("/api/teams");
        const teams = await response.json();
        dispatch(userActions.setTeamsDetails(teams));
        return router.push("/team/invitations");
      }
    } catch (err) {
      setEmailError("發生未知錯誤，請稍後再試");
      console.log(err);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>開始註冊 V-Stats</CardTitle>
      </CardHeader>
      <Form
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4"
      >
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
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>確認密碼</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>請再次輸入密碼</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>使用者名稱</FormLabel>
              <FormControl>
                <Input placeholder="Yuki Ishikawa" {...field} />
              </FormControl>
              <FormDescription>登入後可更改</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full">
          註冊
        </Button>
      </Form>
      <Separator />
      <Link
        className={buttonVariants({ variant: "outline", size: "lg" })}
        href="/sign-in"
      >
        返回登入頁
      </Link>
      <CardFooter />
    </>
  );
};

export default SignUpForm;
