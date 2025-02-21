import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const meta = {
  title: "Design System/Atoms/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1" id="r1" />
        <Label htmlFor="r1">選項一</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="2" id="r2" />
        <Label htmlFor="r2">選項二</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3" id="r3" />
        <Label htmlFor="r3">選項三</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1" id="dr1" disabled />
        <Label htmlFor="dr1" className="text-muted-foreground">
          已禁用選項
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="2" id="dr2" />
        <Label htmlFor="dr2">可用選項</Label>
      </div>
    </RadioGroup>
  ),
};
