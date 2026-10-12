import { clsx, ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach twMerge the Item type tokens from globals.css so `text-xl` etc. still override them.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: { "font-size": [{ text: ["body-list", "subheadline"] }] },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
