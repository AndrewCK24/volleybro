"use client";
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormRadioGroup,
  FormRadioItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { phase, division, category } from "@/lib/text/match";

const formSchema = z.object({
  name: z.string().optional(),
  number: z.coerce.number().int().positive().optional(),
  phase: z.enum(["", "elim", "seed", "qual", "final"]).optional(),
  division: z.enum(["", "men", "women", "mixed"]).optional(),
  category: z.enum(["", "senior", "junior", "youth"]).optional(),
  scoring: z
    .object({
      setCount: z.coerce.number().optional(),
      decidingSetPoints: z.coerce.number().optional(),
    })
    .optional(),
});

const MatchInfoForm = ({ match, onSubmit, className, ...props }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: match?.name || "",
      number: match?.number || "",
      phase: match?.phase || "",
      division: match?.division || "",
      category: match?.category || "",
      scoring: {
        setCount: match?.scoring?.setCount || "",
        decidingSetPoints: match?.scoring?.decidingSetPoints || "",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比賽名稱</FormLabel>
              <FormControl>
                <Input placeholder="Volleyball Nations League" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比賽場次</FormLabel>
              <FormControl>
                <Input
                  placeholder="1"
                  type="number"
                  inputMode="numeric"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比賽階段</FormLabel>
              <FormControl>
                <FormRadioGroup className="grid-cols-2" {...field}>
                  {Object.entries(phase).map(([key, value]) => (
                    <FormRadioItem key={key} value={key}>
                      {value}
                    </FormRadioItem>
                  ))}
                </FormRadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="division"
          render={({ field }) => (
            <FormItem>
              <FormLabel>組別</FormLabel>
              <FormControl>
                <FormRadioGroup className="grid-cols-3" {...field}>
                  {Object.entries(division).map(([key, value]) => (
                    <FormRadioItem key={key} value={key}>
                      {value}
                    </FormRadioItem>
                  ))}
                </FormRadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>年齡組</FormLabel>
              <FormControl>
                <FormRadioGroup className="grid-cols-3" {...field}>
                  {Object.entries(category).map(([key, value]) => (
                    <FormRadioItem key={key} value={key}>
                      {value}
                    </FormRadioItem>
                  ))}
                </FormRadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="scoring.setCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>局數</FormLabel>
              <FormControl>
                <FormRadioGroup className="grid-cols-3" {...field}>
                  <FormRadioItem value={1}>單局</FormRadioItem>
                  <FormRadioItem value={3}>BO3</FormRadioItem>
                  <FormRadioItem value={5}>BO5</FormRadioItem>
                </FormRadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scoring.decidingSetPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>決勝局積分</FormLabel>
              <FormControl>
                <Input
                  placeholder="15"
                  type="number"
                  inputMode="numeric"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button type="submit" size="lg">
            確認
          </Button>
        </DialogClose>
      </Form>
    </DialogContent>
  );
};

export default MatchInfoForm;
