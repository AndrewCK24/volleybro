import { cn } from "@/lib/utils";

export const EntryContainer = ({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "flex flex-row items-center justify-start flex-none w-full gap-1 basis-8",
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

export const EntryScore = ({
  win = false,
  children,
}: {
  win?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center flex-none",
        "basis-8 w-8 h-8 bg-accent text-[1.5rem] rounded-[0.5rem] font-semibold",
        win && "bg-primary text-primary-foreground"
      )}
    >
      {children}
    </div>
  );
};

export const EntryText = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <p
    className={cn(
      "flex flex-row flex-1 text-[1.375rem] items-center gap-1 px-1 h-6",
      "max-w-[calc(100%-9rem)] border-l-[0.125rem]",
      "[&>svg]:w-6 [&>svg]:h-6 stroke-[3px]",
      className
    )}
  >
    {children}
  </p>
);

export const EntryPlayerNumber = ({
  children,
}: {
  children: React.ReactNode;
}) => <span className="text-[1.375rem] font-semibold">{children}</span>;
