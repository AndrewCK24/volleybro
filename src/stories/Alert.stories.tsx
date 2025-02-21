import type { Meta, StoryObj } from "@storybook/react";
import { RiInformationLine, RiAlertLine } from "react-icons/ri";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const meta = {
  title: "Design System/Atoms/Alert",
  component: Alert,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["default", "destructive"],
      control: { type: "select" },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <RiInformationLine />
      <AlertTitle>注意</AlertTitle>
      <AlertDescription>
        這是一個預設樣式的警示訊息，用於展示一般資訊。
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args}>
      <RiAlertLine />
      <AlertTitle>錯誤</AlertTitle>
      <AlertDescription>
        這是一個破壞性的警示訊息，用於顯示錯誤或警告。
      </AlertDescription>
    </Alert>
  ),
};
