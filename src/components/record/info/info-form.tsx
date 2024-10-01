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
  FormRadioGroup,
  FormRadioItem,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { phase, division, category } from "@/src/lib/text/match";

import type { FormMatch } from "@/src/lib/features/record/types";

const infoFormSchema = z.object({
  name: z.string().optional(),
  number: z.coerce.number().int().positive().optional(),
  phase: z.enum(["0", "1", "2", "3", "4"]).optional(),
  division: z.enum(["0", "1", "2", "3"]).optional(),
  category: z.enum(["0", "1", "2", "3"]).optional(),
  scoring: z.object({
    setCount: z.string(),
    decidingSetPoints: z.coerce.number(),
  }),
});

type InfoFormValues = z.infer<typeof infoFormSchema>;

const MatchInfoForm = ({
  info,
  setInfo,
  className,
}: {
  info: FormMatch;
  setInfo: (info: FormMatch) => void;
  className?: string;
}) => {
  const defaultValues = useMemo<InfoFormValues>(
    () => ({
      name: info?.name || "",
      number: info?.number || null,
      phase: info?.phase || "0",
      division: info?.division || "0",
      category: info?.category || "0",
      scoring: {
        setCount: info?.scoring?.setCount || "3",
        decidingSetPoints: info?.scoring?.decidingSetPoints || 15,
      },
    }),
    [info]
  );

  const form = useForm<InfoFormValues>({
    resolver: zodResolver(infoFormSchema),
    defaultValues,
  });

  const onSubmit = (data: InfoFormValues) => {
    setInfo({
      ...info,
      name: data.name,
      number: data.number,
      phase: data.phase,
      division: data.division,
      category: data.category,
      scoring: {
        setCount: data.scoring.setCount,
        decidingSetPoints: data.scoring.decidingSetPoints,
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
        <DialogDescription className="sr-only">填寫比賽相關資訊</DialogDescription>
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
          name="scoring.setCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>局數</FormLabel>
              <FormControl>
                <FormRadioGroup className="grid-cols-3" {...field}>
                  <FormRadioItem value="1">單局</FormRadioItem>
                  <FormRadioItem value="3">BO3</FormRadioItem>
                  <FormRadioItem value="5">BO5</FormRadioItem>
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

export default MatchInfoForm;
