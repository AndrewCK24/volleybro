"use client";
import { useRouter } from "next/navigation";
import { Section } from "@/app/components/common/Section";
import { ListItem, ListItemText } from "@/app/components/common/List";

const Error = () => {
  const router = useRouter();
  return (
    <>
      <Section>
        <h1>Something went wrong...</h1>
      </Section>
      <Section type="transparent">
        <ListItem type="danger" text onClick={() => router.push("/history")}>
          <ListItemText>回到紀錄頁</ListItemText>
        </ListItem>
      </Section>
    </>
  );
};

export default Error;
