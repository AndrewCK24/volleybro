"use client";
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      content = "",
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        "flex items-center justify-center",
        orientation === "horizontal" ? "flex-row" : "flex-col"
      )}
    >
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border flex-1",
          orientation === "horizontal" ? "h-[1px]" : "w-[1px]",
          className
        )}
        {...props}
      />
      <span className="px-2 text-sm text-muted">{content}</span>
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0 bg-border flex-1",
          orientation === "horizontal" ? "h-[1px]" : "w-[1px]",
          className
        )}
        {...props}
      />
    </div>
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
