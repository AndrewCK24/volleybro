"use client";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiCheck } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";

import type { FormMatch } from "@/src/lib/features/record/types";

const miscFormSchema = z.object({
  location: z
    .object({
      city: z.string().optional(),
      hall: z.string().optional(),
    })
    .optional(),
  time: z
    .object({
      date: z.string().optional(),
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
});

type MiscFormValues = z.infer<typeof miscFormSchema>;

const MatchMiscForm = ({
  info,
  setInfo,
  className,
}: {
  info: FormMatch;
  setInfo: (info: FormMatch) => void;
  className?: string;
}) => {
  const defaultValues = useMemo<MiscFormValues>(
    () => ({
      location: {
        city: info?.location?.city || "",
        hall: info?.location?.hall || "",
      },
      time: {
        date: info?.time?.date
          ? new Date(info.time.date).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        start: info?.time?.start
          ? new Date(info.time.start).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        end: info?.time?.end
          ? new Date(info.time.end).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      },
    }),
    [info]
  );

  const form = useForm<MiscFormValues>({
    resolver: zodResolver(miscFormSchema),
    defaultValues,
  });

  const onSubmit = (data: MiscFormValues) => {
    setInfo({
      ...info,
      location: {
        city: data.location.city,
        hall: data.location.hall,
      },
      time: {
        date: data.time.date,
        start: data.time.start,
        end: data.time.end,
      },
    });
  };

  useEffect(() => {
    form.reset({ ...defaultValues });
  }, [info, defaultValues, form]);

  return (
    <DialogContent className={className} size="lg">
      <DialogHeader>
        <DialogTitle>編輯比賽資訊</DialogTitle>
        <DialogDescription className="sr-only">
          填寫比賽相關資訊
        </DialogDescription>
      </DialogHeader>
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="location.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>城市</FormLabel>
              <FormControl>
                <Input placeholder="Taipei" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location.hall"
          render={({ field }) => (
            <FormItem>
              <FormLabel>場地</FormLabel>
              <FormControl>
                <Input placeholder="Taipei Arena" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="time.date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比賽日期</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time.start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>開始時間</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time.end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>結束時間</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button type="submit" size="lg">
            <FiCheck />
            確認
          </Button>
        </DialogClose>
      </Form>
    </DialogContent>
  );
};

export default MatchMiscForm;
