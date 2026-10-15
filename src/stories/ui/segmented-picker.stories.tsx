import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import {
  SegmentedPicker,
  SegmentedPickerItem,
} from "@/components/ui/segmented-picker";

const meta = {
  title: "Design System/Atoms/SegmentedPicker",
  component: SegmentedPicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SegmentedPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "陣容配置",
    value: "0",
    onValueChange: () => {},
    children: null,
  },
  render: (args) => {
    const [value, setValue] = useState("1");
    return (
      <SegmentedPicker {...args} value={value} onValueChange={setValue}>
        {["1", "2", "3"].map((label, index) => (
          <SegmentedPickerItem key={label} value={String(index)}>
            {label}
          </SegmentedPickerItem>
        ))}
      </SegmentedPicker>
    );
  },
};
