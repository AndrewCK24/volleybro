import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { recordActions } from "@/lib/features/record/record-slice";
import { useRecord } from "@/hooks/use-data";
import { RiUserLine, RiCheckLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormRadioGroup,
  FormRadioItem,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LiberoSwitch from "@/components/team/lineup/panels/options/libero-switch";

import type { Player } from "@/entities/record";
import {
  SetOptionsFormSchema,
  type SetOptionsFormValues,
} from "@/lib/features/record/types";

const Options = ({
  recordId,
  members,
  hasPairedSwitchPosition,
}: {
  recordId: string;
  members: Player[];
  hasPairedSwitchPosition: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { lineups } = useAppSelector((state) => state.lineup);
  const { mode } = useAppSelector((state) => state.record);
  const { setIndex } = useAppSelector((state) => state.record[mode].status);
  const { record, mutate } = useRecord(recordId);
  const liberoCount = lineups[0]?.liberos.length;
  const substituteCount = lineups[0]?.substitutes.length;
  const substituteLimit = liberoCount < 2 ? 6 - liberoCount : 6;

  const defaultValues = useMemo<SetOptionsFormValues>(
    () => ({
      serve:
        setIndex === 0 || record?.sets[setIndex - 1]?.options?.serve === "home"
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
    [record, setIndex]
  );

  const form = useForm({
    resolver: zodResolver(SetOptionsFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: SetOptionsFormValues) => {
    const res = await fetch(`/api/records/${recordId}/sets?si=${setIndex}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lineup: lineups[0],
        options: data,
      }),
    });
    const record = await res.json();
    mutate(record, false);
    dispatch(recordActions.initialize(record));
  };

  useEffect(() => {
    form.reset({ ...defaultValues });
  }, [record, setIndex, defaultValues, form]);

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
                      <RiUserLine />
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
            <RiCheckLine />
            確認
          </Button>
        </DialogClose>
      </DialogFooter>
    </Form>
  );
};

export default Options;
