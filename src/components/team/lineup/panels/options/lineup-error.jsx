import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LineupError = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>無法儲存當前陣容配置</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogDescription>
          由於目前陣容中沒有自由球員自動替換所對應的位置，故無法完成陣容設定。
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default LineupError;
