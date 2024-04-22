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
      // content = "",
      ...props
    },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        `shrink-0 bg-border`,
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    >
      {/* {content && (
        <div className="absolute flex items-center justify-center text-xs bg-card text-secondary-foreground">
          {content}
        </div>
      )} */}
    </SeparatorPrimitive.Root>
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
