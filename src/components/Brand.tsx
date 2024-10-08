import Image from "next/image";
import { brand } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function Brand() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/img/logo.png"
        alt="logo"
        className="w-6 h-6"
        height={100}
        width={100}
      />
      <p className={cn("font-medium text-xl", brand.className)}>
        Prigen Panwascam
      </p>
    </div>
  );
}
