import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryList from "./HistoryList";

const HistoryPage = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>比賽紀錄</CardTitle>
      </CardHeader>
      <HistoryList />
    </Card>
  );
};

export default HistoryPage;
