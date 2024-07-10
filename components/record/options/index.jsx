import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecordOptionsRallies from "@/components/record/options/rallies";

const RecordOptions = ({
  recordId,
  options,
  tabValue,
  setTabValue,
  className,
  ...props
}) => {
  return (
    <DialogContent className={className} {...props}>
      <DialogHeader>
        <DialogTitle>
          {tabValue === "overview" && "數據總覽"}
          {tabValue === "rallies" && "逐球紀錄"}
          {tabValue === "settings" && "賽事資訊與設定"}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="sr-only">Options</DialogDescription>
      <Tabs value={tabValue} onValueChange={setTabValue} className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">總覽</TabsTrigger>
          <TabsTrigger value="rallies">紀錄</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex-1">
          <div>總覽</div>
        </TabsContent>
        <TabsContent value="rallies" className="flex-1">
          <RecordOptionsRallies recordId={recordId} />
        </TabsContent>
        <TabsContent value="settings" className="flex-1">
          <div>設定</div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default RecordOptions;
