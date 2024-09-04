import { formatDateRange, propper } from "@/lib/utils";
import { readFileSync } from "fs";
import createReport from "docx-templates";
import { getKetua, getKorSek } from "@/db/db";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  const data: SuratTugas = await request.json();

  const otoritas = data.otoritas == "K.JI" ? getKetua() : getKorSek();
  const tanggal_dinas = formatDateRange(data.date.from, data.date.to);
  const prop: SuratTugasData = {
    nomor: data.nomor,
    otoritas_upper: otoritas.jabatan.toUpperCase(),
    otoritas_propper: propper(otoritas.jabatan),
    perihal_propper: data.perihal,
    perihal_upper: data.perihal.toUpperCase(),
    nomor_undangan: data.undangan,
    kepada:
      data.petugas.length > 1
        ? "(Terlampir)"
        : `${data.petugas[0].nama}\n${data.petugas[0].jabatan}`,
    tanggal_dinas: tanggal_dinas,
    tanggal_dinas_upper: tanggal_dinas.toUpperCase(),
    tempat: data.tempat,
    tanggal_surat: formatDateRange(data.date_create),
    nama_ttd: otoritas.nama,
    nip_ttd: otoritas.nip ? `NIP. ${otoritas.nip}` : "",
    petugas: data.petugas.map((p, i) => ({
      no: i + 1,
      nama: p.nama,
      jabatan: p.jabatan,
      tempat: p.tempat,
      tanggal_dinas: formatDateRange(p.date!.from!, p.date.to),
    })),
  };

  const template = readFileSync(
    data.petugas.length > 1 ? "./ST.multiple.docx" : "./ST.single.docx"
  );
  const buffer = await createReport({
    template,
    data: prop,
    cmdDelimiter: "+++",
  });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="ST.docx"',
      "Content-Length": `${buffer.length}`,
    },
    status: 200,
  });
}
