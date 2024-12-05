"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/features/auth/actions";
import { FcGoogle } from "react-icons/fc";
import { FiAlertTriangle } from "react-icons/fi";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/custom/logo";

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

const SignInForm = () => {
  return (
    <Card className="w-full h-[60%] rounded-lg max-w-[600px] bg-transparent text-primary-foreground">
      <Logo className="justify-start" />
      <p className="text-2xl">
        彈指之間
        <br />
        快速紀錄比賽、查看數據
      </p>
      <CardContent className="justify-end w-full h-full">
        <Suspense>
          <SignInError />
        </Suspense>
        <Button
          variant="outline"
          size="lg"
          className="w-full text-foreground"
          onClick={async () => await signIn("google")}
        >
          <FcGoogle />
          使用 Google 帳戶繼續
        </Button>
      </CardContent>
      <CardFooter className="pb-8">
        <p>如果註冊，即表示您同意服務條款和隱私政策。</p>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
