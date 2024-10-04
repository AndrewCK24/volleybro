import { useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { recordActions } from "@/src/lib/features/record/record-slice";
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

import type { Player } from "@/src/entities/record";

const formSchema = z.object({
  serve: z.enum(["home", "away"]),
  time: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
});

type LineupOptionsValues = z.infer<typeof formSchema>;

const LineupOptions = ({
  recordId,
  members,
  hasPairedSwitchPosition,
}: {
  recordId: string;
  members: Player[];
  hasPairedSwitchPosition: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { lineups } = useAppSelector((state) => state.lineups);
  const { setNum } = useAppSelector((state) => state.record.status);
  const { record, mutate } = useRecord(recordId);
  const liberoCount = lineups[0]?.liberos.length;
  const substituteCount = lineups[0]?.substitutes.length;
  const substituteLimit = liberoCount < 2 ? 6 - liberoCount : 6;

  const defaultValues = useMemo<LineupOptionsValues>(
    () => ({
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
    }),
    [record, setNum]
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: LineupOptionsValues) => {
    const res = await fetch(`/api/records/${recordId}/sets/${setNum}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineup: lineups[0],
        options: data,
      }),
    });
    const set = await res.json();
    record.sets[setNum] = set;
    mutate({ ...record }, false);
    dispatch(recordActions.initialize(record));
  };

  useEffect(() => {
    form.reset({ ...defaultValues });
  }, [record, setNum, defaultValues, form]);

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