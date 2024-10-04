"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/src/lib/auth-actions";
import { FcGoogle } from "react-icons/fc";
import { FiAlertTriangle } from "react-icons/fi";
import { Alert, AlertTitle, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/src/components/ui/card";

const SignInError = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const errorMessage =
    urlError === "OAuthAccountNotLinked"
      ? "看來您已使用其他方式註冊，請使用原註冊方式登入"
      : "";

  if (urlError)
    return (
      <Alert variant="destructive" hidden={!urlError}>
        <FiAlertTriangle />
        <AlertTitle>登入失敗</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
};

const SignInForm = ({ className }: { className: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>歡迎使用 VolleyBro</CardTitle>
      </CardHeader>
      <Suspense>
        <SignInError />
      </Suspense>
      <Button
        variant="outline"
        size="lg"
        onClick={async () => await signIn("google")}
      >
        <FcGoogle />
        使用 Google 帳戶繼續
      </Button>
      <CardFooter />
    </Card>
  );
};

export default SignInForm;
