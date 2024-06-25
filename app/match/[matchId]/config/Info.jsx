"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { recordActions } from "@/app/store/record-slice";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormRadioGroup,
  FormRadioItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  matchName: z.coerce.string().optional(),
  oursName: z.coerce.string().optional(),
  oppoName: z.coerce.string().optional(),
  setCount: z.coerce.number({ message: "請選擇比賽局數" }),
  finalSetPoint: z.coerce.number({ message: "請選擇最終局分數" }),
});

const Info = ({ match, matchId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    _id: teamId,
    name: teamName,
    members,
  } = useSelector((state) => state.team);
  const { info } = match;
  const isNew = matchId === "new";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      matchName: info?.match.name || "",
      oursName: info?.team.ours.name || teamName,
      oppoName: info?.team.oppo.name || "",
      setCount: info?.match.setCount || 3,
      finalSetPoint: info?.match.finalSetPoint || 15,
    },
  });

  const onSubmit = (formData) => {
    dispatch(recordActions.configMatchInfo({ teamId, members, ...formData }));
    isNew
      ? router.replace(`/match/new/lineup`)
      : router.push(`/match/${matchId}`);
  };

  return (
    <>
      <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="matchName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比賽名稱</FormLabel>
              <FormControl>
                <Input placeholder="V-Stats Cup" {...field} />
              </FormControl>
              <FormDescription>請輸入比賽名稱</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oursName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>我方隊伍名稱</FormLabel>
              <FormControl>
                <Input placeholder="Japan" {...field} />
              </FormControl>
              <FormDescription>請輸入我方隊伍名稱</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oppoName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>對手隊伍名稱</FormLabel>
              <FormControl>
                <Input placeholder="USA" {...field} />
              </FormControl>
              <FormDescription>請輸入對手隊伍名稱</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="setCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>比賽局數</FormLabel>
              <FormRadioGroup className="grid-cols-2" {...field}>
                <FormRadioItem variant="destructive" value={3} id="3">
                  3局2勝
                </FormRadioItem>
                <FormRadioItem variant="destructive" value={5} id="5">
                  5局3勝
                </FormRadioItem>
              </FormRadioGroup>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="finalSetPoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>最終局分數</FormLabel>
              <FormRadioGroup className="grid-cols-2" {...field}>
                <FormRadioItem variant="destructive" value={15} id="15">
                  15分
                </FormRadioItem>
                <FormRadioItem variant="destructive" value={25} id="25">
                  25分
                </FormRadioItem>
              </FormRadioGroup>
            </FormItem>
          )}
        />
        <Button size="lg">{isNew ? "下一步" : "儲存資訊"}</Button>
      </Form>
    </>
  );
};

export default Info;
