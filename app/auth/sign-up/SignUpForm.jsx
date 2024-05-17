"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signUp } from "@/lib/auth-actions";
import { FcGoogle } from "react-icons/fc";
import { Button, Link } from "@/components/ui/button";
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
      const session = await signUp("credentials", formData);
      if (session?.error) {
        return form.setError("email", { message: session.error });
      }
    } catch (err) {
      console.log(err);
      form.setError("email", { message: err });
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>開始註冊 V-Stats</CardTitle>
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
      <Separator content="或使用以下方式註冊" />
      {/* <Button
        variant="outline"
        size="lg"
        onClick={async () => await signIn("google")}
      >
        <FcGoogle />
        使用 Google 繼續
      </Button> */}
      <Link variant="ghost" size="lg" href="/sign-in">
        返回登入頁
      </Link>
      <CardFooter />
    </>
  );
};

export default SignUpForm;
