import Image from "next/image";

export const Logo = () => (
  <div className="flex items-center justify-center flex-1 w-full h-auto">
    <Image
      src="/logo.svg"
      alt="v-stats"
      width={200}
      height={50.39}
      priority={true}
    />
  </div>
);
