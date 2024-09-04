import { getKomisioner, getPkd, getSekretariat } from "@/db/db";
import KepegawaianAnggota from "@/components/kepegawaian/KepegawaianAnggota";

export default function Kepegawaian() {
  const komisioner = getKomisioner();
  const sekretariat = getSekretariat();
  const pkd = getPkd();

  return (
    <div className="p-4 grid grid-cols-12 gap-4">
      <div className="col-span-4">
        <KepegawaianAnggota
          title="Komisioner Panwascam"
          description="Daftar Komisioner Panwaslu Kecamatan Prigen"
          datas={komisioner}
        />
      </div>

      <div className="col-span-4">
        <KepegawaianAnggota
          title="Sekretariat Panwaslu"
          description="Daftar Sekretariat Panwaslu Kecamatan Prigen"
          datas={sekretariat}
        />
      </div>

      <div className="col-span-4">
        <KepegawaianAnggota
          title="Panwaslu Kelurahan/Desa"
          description="Daftar Panwaslu Kelurahan/Desa se Kecamatan Prigen"
          datas={pkd}
        />
      </div>
    </div>
  );
}
