import Image from "next/image";
import { cn } from "@/src/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex items-center justify-center flex-1 w-full h-auto",
      className
    )}
  >
    <Image
      src="/logo.svg"
      alt="VolleyBro"
      width={200}
      height={50.39}
      priority={true}
    />
  </div>
);
