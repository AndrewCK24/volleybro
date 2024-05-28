import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { HiArrowsUpDown } from "react-icons/hi2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columns = [
  {
    accessorKey: "image",
    header: () => <FiUser />,
    cell: () => <FiUser />,
    size: 32,
  },
  {
    accessorKey: "number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="lg"
          className="gap-0 svg-[1rem]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No.
          <HiArrowsUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    size: 52,
  },
  {
    accessorKey: "name",
    header: "姓名",
  },
  {
    accessorKey: "meta",
    header: "狀態",
    cell: ({ row }) => {
      const member = row.original;
      const { admin, user_id, email } = member.meta;
      const identity = !email
        ? {
            text: "未邀請",
            type: "secondary",
            icon: <FiXCircle />,
          }
        : !user_id
        ? {
            text: "邀請中",
            type: "outline",
            icon: <FiClock />,
          }
        : !admin
        ? {
            text: "已加入",
            type: "default",
            icon: <FiCheckCircle />,
          }
        : {
            text: "管理者",
            type: "destructive",
            icon: <FiShield />,
          };

      return (
        <Badge variant={identity.type} className="!svg-[1rem]">
          {identity.icon} {identity.text}
        </Badge>
      );
    },
    enableResizing: false,
    size: 96,
  },
];

const TeamMembersTable = ({ data, teamId }) => {
  const [sorting, setSorting] = useState(data);
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Table className="text-lg">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              onClick={() =>
                router.push(`/team/${teamId}/members/${row.original._id}`)
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TeamMembersTable;
