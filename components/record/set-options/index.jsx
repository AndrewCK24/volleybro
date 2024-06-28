import { useDispatch, useSelector } from "react-redux";
import { useRecord } from "@/hooks/use-data";
import { FiCheck } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RecordSetCourt from "@/components/record/set-options/court";
import RecordSetPanels from "@/components/record/set-options/panels";

const RecordSetOptions = ({ recordId, ...props }) => {
  const dispatch = useDispatch();
  const { record } = useRecord(recordId);
  const { status } = useSelector((state) => state.record);

  const open = !record.sets[record.sets.length - 1].meta;

  return (
    <Dialog open={open} onOpenChange={() => {}} {...props}>
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle className="text-center">
            第 {record.sets.length} 局設定
          </DialogTitle>
        </DialogHeader>
        <RecordSetCourt />
        <RecordSetPanels />
        <div className="grid w-full px-4">
          <Button size="lg">
            <FiCheck />
            確定
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordSetOptions;
