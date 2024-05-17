import { FiMeh } from "react-icons/fi";
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
        <FiMeh className="w-[40%] h-[40%] text-destructive" />
      </div>
      <Link variant="outline" size="lg" href="/auth/sign-in">
        Go back to the sign-in page
      </Link>
      <CardFooter />
    </Card>
  );
};

export default Error;
