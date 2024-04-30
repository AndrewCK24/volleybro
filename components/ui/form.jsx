import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = React.forwardRef(
  ({ form, onSubmit, className, ...props }, ref) => {
    return (
      <FormProvider {...form}>
        <form
          ref={ref}
          onSubmit={onSubmit}
          className={cn("flex flex-col gap-4", className)}
          {...props}
        />
      </FormProvider>
    );
  }
);

const FormFieldContext = React.createContext({});

const FormField = ({ ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItemContext = React.createContext({});

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn("flex flex-col gap-1", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormMessage = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {body}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

const FormLabel = React.forwardRef(({ className, required, ...props }, ref) => {
  const { formItemId } = useFormField();

  return (
    <div className="flex flex-row items-baseline gap-2">
      <Label
        ref={ref}
        className={cn(
          `flex items-center font-medium text-base ${
            required && "after:text-destructive after:content-['*']"
          }`,
          className
        )}
        htmlFor={formItemId}
        {...props}
      />
      <FormMessage />
    </div>
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormRadioGroup = React.forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <RadioGroupPrimitive.Root
        className={cn("grid gap-2", className)}
        onValueChange={props.onChange}
        defaultValue={props.value}
        {...props}
        ref={ref}
      >
        {children}
      </RadioGroupPrimitive.Root>
    );
  }
);
FormRadioGroup.displayName = "FormRadioGroup";

const radioItemVariants = cva(
  "flex flex-row items-center justify-center text-lg font-medium transition-colors border-2 rounded-md h-9",
  {
    variants: {
      variant: {
        default:
          "border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground",
        destructive:
          "border-destructive has-[:checked]:bg-destructive has-[:checked]:text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const FormRadioItem = React.forwardRef(
  ({ children, variant, className, value, id, ...props }, ref) => {
    return (
      <FormItem>
        <Label
          htmlFor={id}
          className={cn(radioItemVariants({ variant, className }))}
        >
          <FormControl>
            <RadioGroupPrimitive.Item
              ref={ref}
              id={id}
              value={value}
              className="sr-only"
              {...props}
            />
          </FormControl>
          {children}
        </Label>
      </FormItem>
    );
  }
);
FormRadioItem.displayName = "FormRadioItem";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormRadioGroup,
  FormRadioItem,
};
