import Image from "next/image";

export const Logo = () => (
  <div className="flex items-center justify-center flex-1 w-full">
    <Image src="/logo.svg" alt="v-stats" width={200} height={100} />
  </div>
);
