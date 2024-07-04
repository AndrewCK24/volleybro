"use client";
import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/button";

const Error = () => {
  return (
    <>
      <Card className="w-full">
        <h1>Something went wrong...</h1>
      </Card>
      <Card className="w-full py-0 bg-transparent shadow-none">
        <Link variant="destructive" href="/">
          回到首頁
        </Link>
      </Card>
    </>
  );
};

export default Error;
