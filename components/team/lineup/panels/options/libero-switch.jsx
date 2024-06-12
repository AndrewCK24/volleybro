"use client";
import { useDispatch, useSelector } from "react-redux";
import { lineupsActions } from "@/app/store/lineups-slice";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiChevronRight, FiAlertTriangle, FiHelpCircle } from "react-icons/fi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  mode: z.coerce.number().int().min(0).max(2),
  position: z.enum(["OH", "MB", "OP"]),
});

const LiberoSwitch = () => {
  const dispatch = useDispatch();
  const { lineups, status } = useSelector((state) => state.lineups);
  const { liberoSwitchMode, liberoSwitchPosition } =
    lineups[status.lineupNum]?.options;
  const hasPairedSwitchPosition =
    liberoSwitchPosition === "OP"
      ? true
      : lineups[status.lineupNum]?.starting.some((player, index) => {
          const oppositeIndex = index >= 3 ? index - 3 : index + 3;
          return (
            player._id &&
            player.position === liberoSwitchPosition &&
            lineups[status.lineupNum].starting[oppositeIndex]._id &&
            lineups[status.lineupNum].starting[oppositeIndex].position ===
              liberoSwitchPosition
          );
        });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: liberoSwitchMode.toString(),
      position: liberoSwitchPosition,
    },
  });

  const onSubmit = (formData) => {
    dispatch(
      lineupsActions.setLiberoSwitch({
        mode: formData.mode,
        position: formData.position,
      })
    );
  };

  return (
    <div className="grid gap-2 pb-2 text-xl">
      <h4 className="px-2 text-lg font-medium text-muted-foreground">
        自由球員設定
      </h4>
      <Separator />
      {!!liberoSwitchMode && !hasPairedSwitchPosition && (
        <Alert variant="destructive">
          <FiAlertTriangle />
          <AlertTitle>無對位 {liberoSwitchPosition}</AlertTitle>
          <AlertDescription>
            陣容中未設定對位 {liberoSwitchPosition}
            ，無法使用自動替換自由球員功能。
          </AlertDescription>
        </Alert>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="wide">
            替換模式
            <span className="flex-1 text-left text-primary">
              {liberoSwitchMode === 0 ? "手動替換" : "自動替換"}{" "}
              {liberoSwitchMode ? liberoSwitchPosition : ""}
            </span>
            <FiChevronRight />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>自由球員替換模式</DialogTitle>
            <DialogDescription>
              選擇自由球員替換模式與替換對象。
            </DialogDescription>
          </DialogHeader>
          <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>替換模式</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇替換模式" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">手動替換</SelectItem>
                      <SelectItem value="1">自動替換</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>替換對象</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇替換模式" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MB">MB</SelectItem>
                      <SelectItem value="OH">OH</SelectItem>
                      <SelectItem value="OP">OP</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button type="submit">確定</Button>
            </DialogClose>
          </Form>
        </DialogContent>
      </Dialog>
      {liberoSwitchMode === 0 ? (
        <Alert>
          <FiHelpCircle />
          <AlertTitle>手動替換自由球員</AlertTitle>
          <AlertDescription>
            記錄比賽過程中不會隨著輪轉自動替換自由球員，仍可以手動替換。
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <FiHelpCircle />
          <AlertTitle>自動替換自由球員</AlertTitle>
          <AlertDescription>
            當我方 {liberoSwitchPosition} 發球輪次失分時，自動將該名{" "}
            {liberoSwitchPosition}{" "}
            替換為第一位自由球員。且在自由球員即將輪轉至前排時，自動將自由球員更換為原先之{" "}
            {liberoSwitchPosition}。
          </AlertDescription>
          {liberoSwitchPosition !== "OP" && (
            <AlertDescription className="text-destructive">
              陣容中須有對位之 {liberoSwitchPosition}。
            </AlertDescription>
          )}
        </Alert>
      )}
    </div>
  );
};

export default LiberoSwitch;
