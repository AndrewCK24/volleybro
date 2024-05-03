"use client";
import { useDispatch } from "react-redux";
import { matchActions } from "./match-slice";
import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/button";

const Error = () => {
  const dispatch = useDispatch();
  dispatch(matchActions.resetMatch());

  return (
    <>
      <Card className="w-full">
        <h1>Something went wrong...</h1>
      </Card>
      <Card className="w-full py-0 bg-transparent shadow-none">
        <Link variant="destructive" href="/history">
          回到紀錄頁
        </Link>
      </Card>
    </>
  );
};

export default Error;
