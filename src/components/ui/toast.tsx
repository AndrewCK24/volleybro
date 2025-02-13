"use client";

import * as React from "react";
import { RiCloseLine } from "react-icons/ri";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Viewport>) => (
  <ToastPrimitives.Viewport
    data-slot="ToastViewport"
    className={cn(
      "fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
);

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = ({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants>) => (
  <ToastPrimitives.Root
    data-slot="Toast"
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
);

const ToastAction = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Action>) => (
  <ToastPrimitives.Action
    data-slot="ToastAction"
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-hidden focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.destructive]:bg-destructive hover:group-[.destructive]:text-destructive-foreground focus:group-[.destructive]:ring-destructive",
      className
    )}
    {...props}
  />
);

const ToastClose = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Close>) => (
  <ToastPrimitives.Close
    data-slot="ToastClose"
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-hidden focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 hover:group-[.destructive]:text-red-50 focus:group-[.destructive]:ring-red-400 focus:group-[.destructive]:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <RiCloseLine className="size-4" />
  </ToastPrimitives.Close>
);

const ToastTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Title>) => (
  <ToastPrimitives.Title
    data-slot="ToastTitle"
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
);

const ToastDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof ToastPrimitives.Description>) => (
  <ToastPrimitives.Description
    data-slot="ToastDescription"
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
);

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
