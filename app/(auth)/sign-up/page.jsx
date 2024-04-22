import { Card } from "@/components/ui/card";
import Logo from "@/app/components/common/Logo";
import SignUpForm from "./SignUpForm";

const SignUpPage = () => {
  return (
    <>
      <Logo type="maximized" />
      <Card className="w-full">
        <SignUpForm />
      </Card>
    </>
  );
};

export default SignUpPage;
