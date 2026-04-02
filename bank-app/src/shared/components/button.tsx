import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "px-4 py-2 rounded",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 text-white",
        secondary: "bg-gray-200",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);