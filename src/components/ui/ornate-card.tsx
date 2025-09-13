import * as React from "react";
import { cn } from "@/lib/utils";

const OrnateCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "ornate-frame p-6 transition-all duration-300 hover:shadow-glow hover:scale-[1.02] animate-ornate-entrance",
      className
    )}
    {...props}
  />
));
OrnateCard.displayName = "OrnateCard";

const OrnateCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
OrnateCardHeader.displayName = "OrnateCardHeader";

const OrnateCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-steampunk font-semibold leading-none tracking-tight text-foreground glow-text",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
OrnateCardTitle.displayName = "OrnateCardTitle";

const OrnateCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
OrnateCardDescription.displayName = "OrnateCardDescription";

const OrnateCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
OrnateCardContent.displayName = "OrnateCardContent";

const OrnateCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
OrnateCardFooter.displayName = "OrnateCardFooter";

export {
  OrnateCard,
  OrnateCardHeader,
  OrnateCardFooter,
  OrnateCardTitle,
  OrnateCardDescription,
  OrnateCardContent,
};