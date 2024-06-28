import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RecordOptions = ({ options, onSubmit, className, ...props }) => {
  return (
    <DialogContent className={className} {...props}>
      <DialogHeader>
        <DialogTitle>Options</DialogTitle>
        <DialogClose />
      </DialogHeader>
      <div>Options</div>
      <Button size="lg" onClick={onSubmit}>Save</Button>
    </DialogContent>
  );
}

export default RecordOptions;