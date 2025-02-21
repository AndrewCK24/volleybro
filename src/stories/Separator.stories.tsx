import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@/components/ui/separator";

const meta = {
  title: "Design System/Atoms/Separator",
  component: Separator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div>上方內容</div>
      <Separator />
      <div>下方內容</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-[100px] items-center space-x-4">
      <div>左側</div>
      <Separator orientation="vertical" />
      <div>右側</div>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div>上方內容</div>
      <Separator content="或" />
      <div>下方內容</div>
    </div>
  ),
};
