import * as React from "react";

import { cn } from "@/lib/utils";

const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="Card"
    className={cn(
      "flex flex-col gap-2 bg-card text-card-foreground shadow-sm px-4 py-2",
      className
    )}
    {...props}
  />
);

const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="CardHeader"
    className={cn(
      "flex flex-row justify-start items-center h-10 py-2 gap-2",
      className
    )}
    {...props}
  />
);

const CardBtnGroup = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="CardBtnGroup"
    className={cn(
      "flex-1 flex flex-row justify-end items-center gap-2",
      className
    )}
    {...props}
  />
);

const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    data-slot="CardTitle"
    className={cn(
      "flex flex-row justify-start items-center text-xl font-medium leading-none tracking-tight gap-1",
      className
    )}
    {...props}
  />
);

const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    data-slot="CardDescription"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="CardContent"
    className={cn("flex flex-col gap-2 justify-start items-center", className)}
    {...props}
  />
);

const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="CardFooter"
    className={cn("flex flex-col pb-2", className)}
    {...props}
  />
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardBtnGroup,
  CardDescription,
  CardContent,
};
