import { Card } from "@/components/ui/card";
import Logo from "@/app/components/common/Logo";
import SignInForm from "./SignInForm";

const SignInPage = () => {
  return (
    <>
      <Logo type="maximized" />
      <Card className="w-full">
        <SignInForm />
      </Card>
    </>
  );
};

export default SignInPage;
