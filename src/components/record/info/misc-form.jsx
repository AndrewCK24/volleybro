"use client";
import { useEffect } from "react";
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

const formSchema = z.object({
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

const MatchMiscForm = ({ match, onSubmit, className, ...props }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: {
        city: match?.location?.city || "",
        hall: match?.location?.hall || "",
      },
      time: {
        date: match?.time?.date
          ? new Date(match.time.date).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        start: match?.time?.start
          ? new Date(match.time.start).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        end: match?.time?.end
          ? new Date(match.time.end).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      },
    },
  });

  useEffect(() => {
    form.reset({ name: match?.name || "" });
  }, [match, form]);

  return (
    <DialogContent className={className} {...props}>
      <DialogHeader>
        <DialogTitle>編輯比賽資訊</DialogTitle>
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
