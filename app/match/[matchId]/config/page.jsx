"use client";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import Info from "./Info";

const ConfigPage = ({ params }) => {
  const { id } = params;
  const match = useSelector((state) => state.match);

  return (
    <Card className="w-full">
      <Info match={match} matchId={id} />
    </Card>
  );
};

export default ConfigPage;
