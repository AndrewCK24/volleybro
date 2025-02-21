import type { Meta, StoryObj } from "@storybook/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

const meta = {
  title: "Design System/Molecules/Toast",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function ShowToast() {
    const { toast } = useToast();
    return (
      <Button
        onClick={() =>
          toast({
            title: "已完成",
            description: "操作已成功完成",
          })
        }
      >
        顯示通知
      </Button>
    );
  },
};

export const WithAction: Story = {
  render: function ShowActionToast() {
    const { toast } = useToast();
    return (
      <Button
        onClick={() =>
          toast({
            title: "更新可用",
            description: "新版本已經準備就緒",
            action: (
              <Button variant="outline" size="sm">
                立即更新
              </Button>
            ),
          })
        }
      >
        帶有操作的通知
      </Button>
    );
  },
};

export const Destructive: Story = {
  render: function ShowDestructiveToast() {
    const { toast } = useToast();
    return (
      <Button
        variant="destructive"
        onClick={() =>
          toast({
            variant: "destructive",
            title: "錯誤",
            description: "發生了一些問題",
          })
        }
      >
        錯誤通知
      </Button>
    );
  },
};
