import SuratNav from "@/components/surat/SuratNav";
import { PropsWithChildren } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function SuratLayout({ children }: PropsWithChildren) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h1 className="font-bold text-xl uppercase">Surat Menyurat</h1>
        <p className="text-muted-foreground">
          Surat Menyurat Panwaslu Kecamatan Prigen
        </p>
      </div>

      <SuratNav />

      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col gap-2">
          <div className="border-b pb-2">
            <h3 className="font-bold">Penomoran</h3>
            <p className="text-sm text-muted-foreground">
              Index penomoran surat masuk panwaslu kecamatan prigen
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="https://docs.google.com/spreadsheets/d/1fUxccq9A-hCK8mk2WzZ70Ycccn0B615XthOYHB0a6lw/edit"
              target="_blank"
            >
              <Card className="cursor-pointer hover:bg-muted">
                <CardContent className="p-2 space-y-2">
                  <div className="flex gap-2 items-center">
                    <Inbox />
                    <div className="flex-1">
                      <p className="font-medium">Surat Masuk</p>
                      <p className="text-muted-foreground text-sm">
                        Index surat masuk
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link
              href="https://docs.google.com/spreadsheets/d/1fUxccq9A-hCK8mk2WzZ70Ycccn0B615XthOYHB0a6lw/edit"
              target="_blank"
            >
              <Card className="cursor-pointer hover:bg-muted">
                <CardContent className="p-2 space-y-2">
                  <div className="flex gap-2 items-center">
                    <MessageSquare />
                    <div className="flex-1">
                      <p className="font-medium">Surat Keluar</p>
                      <p className="text-muted-foreground text-sm">
                        Index surat keluar
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          <div className="flex flex-col gap-2"></div>
        </div>
        <div className="col-span-3">{children}</div>
      </div>
    </div>
  );
}
