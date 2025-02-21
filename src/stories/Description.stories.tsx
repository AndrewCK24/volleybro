import type { Meta, StoryObj } from "@storybook/react";
import { RiInformationLine, RiArrowRightLine } from "react-icons/ri";

import {
  Description,
  DescriptionTitle,
  DescriptionContent,
} from "@/components/ui/description";

const meta = {
  title: "Design System/Molecules/Description",
  component: Description,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Description>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Description>
      <DescriptionTitle>基本說明</DescriptionTitle>
      <DescriptionContent>這是一段說明文字的內容</DescriptionContent>
    </Description>
  ),
};

export const WithStartIcon: Story = {
  render: () => (
    <Description startIcon={<RiInformationLine />}>
      <DescriptionTitle>帶有起始圖示</DescriptionTitle>
      <DescriptionContent>在左側添加資訊圖示的說明文字</DescriptionContent>
    </Description>
  ),
};

export const WithEndIcon: Story = {
  render: () => (
    <Description endIcon={<RiArrowRightLine />}>
      <DescriptionTitle>帶有結尾圖示</DescriptionTitle>
      <DescriptionContent>在右側添加箭頭圖示的說明文字</DescriptionContent>
    </Description>
  ),
};

export const WithBothIcons: Story = {
  render: () => (
    <Description
      startIcon={<RiInformationLine />}
      endIcon={<RiArrowRightLine />}
    >
      <DescriptionTitle>雙側圖示</DescriptionTitle>
      <DescriptionContent>在兩側都添加圖示的說明文字範例</DescriptionContent>
    </Description>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Description startIcon={<RiInformationLine />}>
      <DescriptionTitle>較長的說明標題範例</DescriptionTitle>
      <DescriptionContent>
        這是一段較長的說明文字內容，用來展示當內容較多時的排版效果。
        在這裡可以放置更詳細的說明資訊，幫助使用者更好地理解功能或內容。
      </DescriptionContent>
    </Description>
  ),
};
