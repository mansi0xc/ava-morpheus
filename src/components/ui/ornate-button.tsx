import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ornateButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-ornate text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-surface border-2 border-primary text-foreground hover:bg-surface-elevated shadow-glow",
        hero: "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow animate-border-glow font-steampunk font-bold",
        ornate: "ornate-frame text-foreground hover:shadow-glow hover:scale-105 transition-transform",
        gear: "bg-surface border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground shadow-glow relative",
        ghost: "hover:bg-surface hover:text-foreground border border-border hover:border-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-ornate px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface OrnateButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ornateButtonVariants> {
  asChild?: boolean;
}

const OrnateButton = React.forwardRef<HTMLButtonElement, OrnateButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(ornateButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {variant === "gear" && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-8 h-8 rounded-full border-2 border-current animate-gear-rotate" />
          </div>
        )}
        {children}
      </Comp>
    );
  }
);
OrnateButton.displayName = "OrnateButton";

export { OrnateButton, ornateButtonVariants };