import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const RecordOptions = ({ options, onSubmit, className, ...props }) => {
  return (
    <DialogContent className={className} {...props}>
      <DialogHeader>
        <DialogTitle>Options</DialogTitle>
      </DialogHeader>
      <DialogDescription>Options</DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
          <Button size="lg" onClick={onSubmit}>
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default RecordOptions;
