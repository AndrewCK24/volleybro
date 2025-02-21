import type { Meta, StoryObj } from "@storybook/react";
import { RiMore2Fill, RiEditFill, RiDeleteBinLine } from "react-icons/ri";

import {
  Card,
  CardHeader,
  CardTitle,
  CardBtnGroup,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Design System/Molecules/Card",
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>卡片標題</CardTitle>
      </CardHeader>
      <CardContent>
        <p>這是卡片的內容區域，可以放置任何內容。</p>
      </CardContent>
    </Card>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>使用說明</CardTitle>
        <CardDescription>這裡是卡片的補充說明文字</CardDescription>
      </CardHeader>
      <CardContent>
        <p>主要內容區域</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">更新於 2024/03/21</p>
      </CardFooter>
    </Card>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>操作範例</CardTitle>
        <CardBtnGroup>
          <Button variant="ghost" size="icon">
            <RiEditFill />
          </Button>
          <Button variant="ghost" size="icon">
            <RiDeleteBinLine />
          </Button>
          <Button variant="ghost" size="icon">
            <RiMore2Fill />
          </Button>
        </CardBtnGroup>
      </CardHeader>
      <CardContent>
        <p>這個卡片展示了如何在標題區域添加操作按鈕。</p>
      </CardContent>
    </Card>
  ),
};
