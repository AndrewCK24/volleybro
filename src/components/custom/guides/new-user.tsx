import { auth } from "@/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "@/components/ui/button";

export const GuidesForNewUser = async () => {
  const session = await auth();
  if (!session?.user) return null;
  const { user } = session;

  return <>{user && !user?.teams?.joined?.length && <Message />}</>;
};

const Message = () => {
  return (
    <Card className="flex items-center justify-center w-full">
      <CardHeader>
        <CardTitle>歡迎使用 VolleyBro !</CardTitle>
      </CardHeader>
      <CardContent>
        <p>加入隊伍後，您將可以使用完整功能。</p>
        <p>點擊下方按鈕，加入或建立一個隊伍吧！</p>
      </CardContent>
      <CardFooter>
        <Link href="/user/invitations" size="lg" className="px-4">
          前往查看
        </Link>
      </CardFooter>
    </Card>
  );
};
