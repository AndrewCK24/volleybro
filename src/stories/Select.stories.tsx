import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const meta = {
  title: "Design System/Atoms/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="請選擇..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">選項一</SelectItem>
        <SelectItem value="2">選項二</SelectItem>
        <SelectItem value="3">選項三</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="2">
      <SelectTrigger className="w-[200px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">選項一</SelectItem>
        <SelectItem value="2">選項二</SelectItem>
        <SelectItem value="3">選項三</SelectItem>
      </SelectContent>
    </Select>
  ),
};
