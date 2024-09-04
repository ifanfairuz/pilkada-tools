import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";
import { capitalize } from "@/lib/utils";

export default function AnggotaCard({ data }: { data: Pegawai }) {
  const initialname = useMemo(
    () =>
      data.nama
        .split(" ", 2)
        .map((n) => n.at(0)?.toUpperCase() || "")
        .join(""),
    [data.nama]
  );

  return (
    <Card className="cursor-pointer hover:bg-muted">
      <CardContent className="p-2 space-y-2">
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{initialname}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{data.nama}</p>
          </div>
          <Badge variant="outline">{data.jabatan}</Badge>
        </div>
        {data.jenis == "panwascam" && (
          <p className="text-muted-foreground text-sm">{data.devisi}</p>
        )}
      </CardContent>
    </Card>
  );
}
