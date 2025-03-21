import { RiSpamLine } from "react-icons/ri";
import { Link } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const Error = () => {
  return (
    <Card className="flex-1 w-full">
      <CardHeader>
        <CardTitle>Error</CardTitle>
      </CardHeader>
      <div className="text-destructive">Oops... Something went wrong!</div>
      <div className="flex items-center justify-center flex-1">
        <RiSpamLine className="size-[40%] text-destructive" />
      </div>
      <Link variant="outline" size="lg" href="/auth/sign-in">
        Go back to the sign-in page
      </Link>
      <CardFooter />
    </Card>
  );
};

export default Error;
