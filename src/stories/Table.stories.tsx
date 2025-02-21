import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const meta = {
  title: "Design System/Molecules/Table",
  component: Table,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "已付款",
    totalAmount: "$250.00",
    paymentMethod: "信用卡",
  },
  {
    invoice: "INV002",
    paymentStatus: "待處理",
    totalAmount: "$150.00",
    paymentMethod: "銀行轉帳",
  },
  {
    invoice: "INV003",
    paymentStatus: "已付款",
    totalAmount: "$350.00",
    paymentMethod: "信用卡",
  },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>近期訂單列表</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>訂單編號</TableHead>
          <TableHead>付款狀態</TableHead>
          <TableHead>金額</TableHead>
          <TableHead>付款方式</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>
              <Badge
                variant={
                  invoice.paymentStatus === "已付款" ? "default" : "outline"
                }
              >
                {invoice.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>總計</TableCell>
          <TableCell>$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const Simple: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名稱</TableHead>
          <TableHead>狀態</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">項目 A</TableCell>
          <TableCell>使用中</TableCell>
          <TableCell>檢視</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">項目 B</TableCell>
          <TableCell>停用</TableCell>
          <TableCell>編輯</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
