import { PickerRow } from "@/components/custom/picker-row";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

const meta = {
  title: "Design System/Composites/PickerRow",
  component: PickerRow,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { code: "7", label: "Alice Chen", onClick: fn() },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PickerRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pressed: Story = { args: { pressed: true } };

export const Disabled: Story = { args: { disabled: true } };
