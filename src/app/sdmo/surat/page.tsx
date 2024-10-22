import { FormSuratTugas } from "@/components/surat/FormSuratTugas";
import { db } from "@/db/db";

export default function Surat() {
  const pegawai = db.data.anggota;
  return (
    <div className="flex flex-col gap-2">
      <div className="border-b pb-2 flex items-center">
        <div className="flex-1">
          <h3 className="font-bold">Surat Tugas Generator</h3>
          <p className="text-sm text-muted-foreground">
            Generator surat tugas panwaslu kecamatan prigen
          </p>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <FormSuratTugas pegawai={pegawai} />
      </div>
    </div>
  );
}
