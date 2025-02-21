import type { Meta, StoryObj } from "@storybook/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Design System/Molecules/Dialog",
  component: Dialog,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>打開對話框</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>標題</DialogTitle>
          <DialogDescription>這是一段說明文字</DialogDescription>
        </DialogHeader>
        <div className="py-4">這裡是對話框的主要內容區域</div>
        <DialogFooter>
          <Button variant="secondary">取消</Button>
          <Button>確認</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Large: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>大型對話框</Button>
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>大型對話框</DialogTitle>
          <DialogDescription>這是一個全螢幕的對話框範例</DialogDescription>
        </DialogHeader>
        <div className="py-4">可以放置更多的內容</div>
        <DialogFooter>
          <Button variant="secondary">取消</Button>
          <Button>確認</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
