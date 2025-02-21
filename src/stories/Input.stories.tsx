import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";

const meta = {
  title: "Design System/Atoms/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Input placeholder="請輸入..." className="w-[300px]" />,
};

export const WithValue: Story = {
  render: () => (
    <Input value="預設文字" onChange={() => {}} className="w-[300px]" />
  ),
};

export const Disabled: Story = {
  render: () => <Input disabled value="禁用狀態" className="w-[300px]" />,
};
