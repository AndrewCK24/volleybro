import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const meta = {
  title: "Design System/Molecules/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">帳號設定</TabsTrigger>
        <TabsTrigger value="password">密碼設定</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardContent className="pt-6">
            帳號設定的相關內容會顯示在這裡
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardContent className="pt-6">
            密碼設定的相關內容會顯示在這裡
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">分類一</TabsTrigger>
        <TabsTrigger value="tab2">分類二</TabsTrigger>
        <TabsTrigger value="tab3">分類三</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">這是分類一的內容區域</TabsContent>
      <TabsContent value="tab2">這是分類二的內容區域</TabsContent>
      <TabsContent value="tab3">這是分類三的內容區域</TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="active">使用中</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          已停用
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">這是使用中的頁籤內容</TabsContent>
      <TabsContent value="disabled">這個內容不會被顯示</TabsContent>
    </Tabs>
  ),
};
