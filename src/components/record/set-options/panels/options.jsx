import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { recordActions } from "@/src/app/store/record-slice";
import { useRecord } from "@/src/hooks/use-data";
import { FiUser, FiCheck } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { DialogFooter, DialogClose } from "@/src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormRadioGroup,
  FormRadioItem,
} from "@/src/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import LiberoSwitch from "@/src/components/team/lineup/panels/options/libero-switch";

const formSchema = z.object({
  serve: z.enum(["home", "away"]),
  time: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
});

const LineupOptions = ({ recordId, members, hasPairedSwitchPosition }) => {
  const dispatch = useDispatch();
  const { lineups } = useSelector((state) => state.lineups);
  const { setNum } = useSelector((state) => state.record.status);
  const { record, mutate } = useRecord(recordId);
  const liberoCount = lineups[0]?.liberos.length;
  const substituteCount = lineups[0]?.substitutes.length;
  const substituteLimit = liberoCount < 2 ? 6 - liberoCount : 6;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serve:
        setNum === 0 || record.sets[setNum - 1].options.serve === "home"
          ? "away"
          : "home",
      time: {
        start: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        end: "",
      },
    },
  });

  useEffect(() => {
    form.reset({
      serve:
        setNum === 0 || record.sets[setNum - 1].options.serve === "home"
          ? "away"
          : "home",
      time: {
        start: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        end: "",
      },
    });
  }, [record, setNum, form]);

  const onSubmit = async (formData) => {
    const res = await fetch(`/api/records/${recordId}/sets/${setNum}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineup: lineups[0],
        options: formData,
      }),
    });
    const set = await res.json();
    record.sets[setNum] = set;
    mutate({ ...record }, false);
    dispatch(recordActions.initialize(record));
  };

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col flex-1 w-full gap-2 pt-2 overflow-auto"
    >
      <Card className="flex-1 p-0 overflow-scroll shadow-none">
        <FormField
          control={form.control}
          name="serve"
          render={({ field }) => (
            <FormItem>
              <FormLabel>發球權</FormLabel>
              <FormControl>
                <FormRadioGroup className="grid-cols-2" {...field}>
                  <FormRadioItem value="home">我方先發</FormRadioItem>
                  <FormRadioItem value="away">對方先發</FormRadioItem>
                </FormRadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <LiberoSwitch />
        <Table>
          <TableHeader className="text-lg">
            <TableRow>
              <TableHead colSpan={3}>
                替補名單 ({substituteCount}/{substituteLimit})
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xl">
            {lineups[0]?.substitutes &&
              lineups[0].substitutes.map((player) => {
                const member = members?.find((m) => m._id === player._id);
                return (
                  <TableRow key={member._id}>
                    <TableCell className="w-6 [&>svg]:w-6 [&>svg]:h-6">
                      <FiUser />
                    </TableCell>
                    <TableCell className="text-right w-[2.5rem]">
                      {member?.number}
                    </TableCell>
                    <TableCell>{member?.name}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Card>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit" size="lg" disabled={!hasPairedSwitchPosition}>
            <FiCheck />
            確認
          </Button>
        </DialogClose>
      </DialogFooter>
    </Form>
  );
};

export default LineupOptions;
