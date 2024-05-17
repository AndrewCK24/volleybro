"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-actions";
import { FcGoogle } from "react-icons/fc";
import { FiAlertTriangle } from "react-icons/fi";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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

export const SignInSchema = z
  .object({
    email: z.string().email({ message: "請輸入有效的 email" }),
    password: z.string().min(6, { message: "請輸入長度 6-20 密碼" }),
  })
  .required();

const SignInError = ({ error }) => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const errorMessage =
    urlError === "OAuthAccountNotLinked"
      ? "看來您已使用其他方式註冊，請使用原註冊方式登入"
      : "";
  return (
    <Alert variant="destructive" hidden={!error && !urlError}>
      <FiAlertTriangle />
      <AlertTitle>登入失敗</AlertTitle>
      <AlertDescription>{error || errorMessage}</AlertDescription>
    </Alert>
  );
};

const SignInForm = () => {
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (formData) => {
    try {
      const session = await signIn("credentials", formData);
      if (session?.error) return setError("帳號或密碼錯誤");
    } catch (err) {
      return setError("發生未知錯誤，請稍後再試");
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>歡迎使用 V-Stats</CardTitle>
      </CardHeader>
      <Suspense>
        <SignInError error={error} />
      </Suspense>
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
      <Button
        variant="outline"
        size="lg"
        onClick={async () => await signIn("google")}
      >
        <FcGoogle />
        使用 Google 繼續
      </Button>
      <Link variant="ghost" size="lg" href="/auth/sign-up">
        註冊新帳號
      </Link>
      <CardFooter />
    </>
  );
};

export default SignInForm;
