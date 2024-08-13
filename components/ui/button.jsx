import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 xl:hover:underline",
        option_win:
          "bg-[rgba(183,210,216,1)] text-foreground [&>svg]:text-primary shadow hover:bg-primary/80",
        option_lose:
          "bg-[rgba(254,215,204,1)] text-foreground [&>svg]:text-destructive shadow hover:bg-destructive/80",
      },
      size: {
        default: "h-9 rounded-md px-2 py-2 text-sm svg-[1.25rem]",
        xs: "h-4 rounded-md text-xs svg-[1rem]",
        sm: "h-8 rounded-md p-0 md:px-3 text-xs svg-[1rem]",
        lg: "h-10 rounded-md p-0 md:px-8 text-lg svg-[1.5rem]",
        wide: "w-full h-10 px-3 text-lg rounded-md svg-[1.5rem] justify-start",
        icon: "h-6 w-6 svg-[1.5rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const ButtonLink = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Link
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonLink.displayName = "ButtonLink";

export { Button, ButtonLink as Link, buttonVariants };
