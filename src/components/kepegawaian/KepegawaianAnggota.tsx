"use client";

import AnggotaCard from "./AnggotaCard";
import { useState } from "react";

export default function KepegawaianAnggota({
  title,
  description,
  datas,
}: KepegawaianAnggotaProps) {
  const [anggota, setAnggota] = useState(datas);

  return (
    <div className="flex flex-col gap-2">
      <div className="border-b pb-2 flex items-center">
        <div className="flex-1">
          <h3 className="font-bold">{title}</h3>
          {!!description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {anggota.map((data, i) => (
          <AnggotaCard key={i} data={data} />
        ))}
      </div>
    </div>
  );
}

export interface KepegawaianAnggotaProps {
  title: string;
  description?: string;
  datas: Pegawai[];
}
