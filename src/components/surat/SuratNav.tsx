"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigations = [
  {
    label: "Surat Tugas",
    href: "/sdmo/surat",
  },
  {
    label: "SPPD",
    href: "/sdmo/surat/sppd",
  },
];

export default function SuratNav() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="rounded-lg bg-muted p-1">
      <NavigationMenuList className="items-center">
        {navigations.map((nav, index) => (
          <Item key={index} {...nav} active={pathname === nav.href} />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ItemProps {
  label: string;
  href: string;
  active: boolean;
}
const Item = ({ label, href, active }: ItemProps) => {
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            navigationMenuTriggerStyle(),
            "h-auto bg-muted hover:bg-background focus:bg-background active:bg-background px-2 py-1.5 font-medium",
            active ? "bg-background" : ""
          )}
        >
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
};
