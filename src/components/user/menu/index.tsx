"use client";
import { Card } from "@/components/ui/card";
import {
  Item,
  ItemAvatar,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { DarkMode } from "@/components/user/menu/dark-mode";
import { useUser } from "@/hooks/use-data";
import Link from "next/link";
import { RiSettings4Line, RiUserLine } from "react-icons/ri";

const Menu = ({ className }: { className?: string }) => {
  const { user } = useUser();

  return (
    <Card className={className}>
      <Item asChild>
        <button type="button">
          <ItemMedia>
            <ItemAvatar
              className="size-6"
              src={user?.image}
              alt={user?.name}
              fallback={<RiUserLine />}
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              {!user ? <Skeleton className="h-6 w-64" /> : user?.name}
            </ItemTitle>
          </ItemContent>
        </button>
      </Item>
      <Item asChild variant="muted">
        <Link href="/user/invitations">
          <ItemContent>
            <ItemTitle>查看邀請</ItemTitle>
          </ItemContent>
        </Link>
      </Item>
      <Item asChild variant="muted">
        <button type="button">
          <ItemMedia>
            <RiSettings4Line />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>設定</ItemTitle>
          </ItemContent>
        </button>
      </Item>
      <DarkMode />
    </Card>
  );
};

export default Menu;
