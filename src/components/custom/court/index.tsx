import { cn } from "@/src/lib/utils";
import { FiPlus, FiX, FiRepeat } from "react-icons/fi";

import type { Player } from "@/src/entities/record";

export const Court = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center w-full max-h-[35vh] aspect-[11/9] bg-primary p-2",
        className
      )}
    >
      {children}
    </div>
  );
};

export const Outside = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative grid h-full grid-rows-3 gap-2 border-4 border-transparent before:content-[''] before:absolute before:top-0 before:w-full before:min-h-[calc((100%-1rem)/3)] before:border-b-4 before:border-dashed before:border-primary-foreground border-l-0 pr-1 flex-1",
        className
      )}
    >
      {children}
    </div>
  );
};
// TODO: 目前手機版未沒有寬度更大的球場，未來需注意其他螢幕大小的排版

export const Inside = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative flex-[9] aspect-[1/1] h-full py-[5%] px-2 grid [grid-template-areas:'z4_z3_z2''z5_z6_z1'] gap-2 bg-[rgba(253,162,137,1)] border-4 border-primary-foreground before:content-[''] before:absolute before:top-0 before:w-full before:min-h-[calc((100%-1rem)/3)] before:bg-destructive before:border-b-4">
      {children}
    </div>
  );
};

// TODO: 移除 onSwitchClick 後，重新檢視參數定義
const Card = ({
  children,
  className,
  onClick,
  empty,
  toggled,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  empty?: boolean;
  toggled?: boolean;
  [key: string]: any;
}) => {
  return (
    <div
      className={cn(
        "relative w-full h-full flex flex-col items-center justify-center",
        "p-1 rounded-lg border-4 border-primary-foreground bg-primary-foreground",
        "transition-all duration-200 z-1",
        empty && "bg-primary-foreground/50 border-primary-foreground/50",
        toggled && "bg-primary text-primary-foreground",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const Number = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "flex items-center justify-center",
        "max-h-[3rem] min-h-[3rem] max-w-[3rem] min-w-[3rem]",
        "text-[3rem] font-bold svg-[3rem]"
      )}
    >
      {children}
    </p>
  );
};

const Position = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "flex items-center justify-center",
        "max-h-[1.25rem] min-h-[1.25rem] max-w-[1.25rem] min-w-[1.25rem]",
        "text-[1.25rem] font-normal svg-[1.25rem]"
      )}
    >
      {children}
    </p>
  );
};

// TODO: 移除 onSwitchClick 後，重新檢視參數定義，刪除 right 參數
const Button = ({
  onClick,
  right,
  children,
}: {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  right?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "absolute w-[1.5rem] h-[1.5rem] aspect-[1/1]",
        "flex items-center justify-center",
        "m-1 border-2 border-primary-foreground rounded-full",
        "transition-all duration-200",
        "text-primary-foreground svg-[1.25rem]",
        right
          ? "top-[-0.75rem] right-[-0.75rem] bg-destructive"
          : "top-[-0.75rem] left-[-0.75rem] bg-primary"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const PlayerCard = ({
  player,
  list,
  zone,
  onCardClick,
  onSwitchClick,
  onCrossClick,
  editingMember,
}: {
  player: Player & { position: string };
  list: string;
  zone: number;
  onCardClick: () => void;
  onSwitchClick?: () => void;
  onCrossClick?: () => void;
  editingMember: { _id: string; list: string; zone: number };
}) => {
  const toggled = editingMember.list === list && editingMember.zone === zone;
  return (
    <Card
      style={list === "starting" ? { gridArea: `z${zone}` } : {}}
      toggled={toggled}
      empty={!player}
      onClick={(e) => {
        e.stopPropagation();
        onCardClick();
      }}
    >
      {player ? (
        <>
          <Number>{player.number}</Number>
          <Position>{player.position}</Position>
          {toggled && (
            <>
              <Button
                right={false}
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchClick();
                }}
              >
                <FiRepeat />
              </Button>
              {onCrossClick && (
                <Button
                  right={true}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCrossClick();
                  }}
                >
                  <FiX />
                </Button>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Number>
            <FiPlus />
          </Number>
          <Position />
        </>
      )}
    </Card>
  );
};

export const LoadingCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn("motion-safe:animate-pulse", className)}>
      <Number />
      <Position />
    </Card>
  );
};

export const PlaceholderCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn("bg-transparent border-none", className)}>
      <Number />
      <Position />
    </Card>
  );
};

export const AdjustButton = ({
  onClick,
  children,
}: {
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        "text-primary-foreground svg-[2.5rem]",
        "z-10"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
