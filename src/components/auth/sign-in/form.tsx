"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/features/auth/actions";
import { FcGoogle } from "react-icons/fc";
import { RiAlertLine } from "react-icons/ri";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
        <RiAlertLine />
        <AlertTitle>登入失敗</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
};

const SignInForm = () => {
  return (
    <Card className="w-full h-[50%] rounded-lg max-w-[600px] bg-transparent text-primary-foreground shadow-none">
      <CardHeader className="flex-col items-start flex-1">
        <Logo className="justify-start max-h-fit" />
        <p className="text-2xl">快速記錄每一場精彩的比賽。</p>
      </CardHeader>
      <Separator className="bg-primary-foreground" />
      <CardContent>
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
      <CardFooter className="pb-[15vh] items-center">
        <p className="font-thin text-accent">
          如果註冊，即表示您同意服務條款和隱私政策。
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInForm;
