import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RecordOptions = ({
  options,
  tabValue,
  setTabValue,
  className,
  ...props
}) => {
  return (
    <DialogContent className={className} {...props}>
      <DialogHeader>
        <DialogTitle>Options</DialogTitle>
      </DialogHeader>
      <DialogDescription className="sr-only">Options</DialogDescription>
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="sticky top-0 z-10 grid w-full grid-cols-3">
          <TabsTrigger value="overview">總覽</TabsTrigger>
          <TabsTrigger value="rallies">紀錄</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div>總覽</div>
        </TabsContent>
        <TabsContent value="rallies">
          <div>紀錄</div>
        </TabsContent>
        <TabsContent value="settings">
          <div>設定</div>
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <DialogClose asChild>
          <Button size="lg">Save</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default RecordOptions;
