import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const meta = {
  title: "Design System/Atoms/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Label>標籤文字</Label>,
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="input">使用者名稱</Label>
      <Input id="input" placeholder="請輸入使用者名稱" className="w-[300px]" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="disabled-input" className="text-muted-foreground">
        禁用狀態
      </Label>
      <Input
        id="disabled-input"
        disabled
        value="無法編輯"
        className="w-[300px]"
      />
    </div>
  ),
};
