import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link, { type LinkProps as NextLinkProps } from "next/link";

import { cn } from "@/src/lib/utils";

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
      },
      size: {
        default: "h-9 rounded-md px-2 py-2 text-sm [&>svg]:h-5 [&>svg]:w-5",
        xs: "h-4 rounded-md text-xs [&>svg]:h-4 [&>svg]:w-4",
        sm: "h-8 rounded-md p-0 md:px-3 text-xs [&>svg]:h-4 [&>svg]:w-4",
        lg: "h-10 rounded-md p-0 md:px-8 text-lg [&>svg]:h-6 [&>svg]:w-6",
        wide: "w-full h-10 px-3 text-lg rounded-md justify-start [&>svg]:h-6 [&>svg]:w-6",
        icon: "h-6 w-6 [&>svg]:h-6 [&>svg]:w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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

export interface LinkProps
  extends NextLinkProps,
    React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {}

const ButtonLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
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
