"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const MatchInfo = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>詳細資訊</CardTitle>
      </CardHeader>
      <CardHeader>
        <CardTitle>陣容名單</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default MatchInfo;
