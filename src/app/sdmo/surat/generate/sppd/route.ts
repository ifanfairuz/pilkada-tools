import { convertTerbilang, formatDateRange, lamaPerdin } from "@/lib/utils";
import { readFileSync } from "fs";
import createReport from "docx-templates";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  const data: SPPD = await request.json();

  const tanggal_dinas = formatDateRange(
    data.petugas.date.from,
    data.petugas.date.to
  );
  const tanggal_awal_dinas = formatDateRange(data.petugas.date.from);
  const tanggal_akhir_dinas = formatDateRange(
    data.petugas.date.to || data.petugas.date.from
  );
  const lama = lamaPerdin(data.petugas.date.from, data.petugas.date.to);
  const prop: SPPDData = {
    nama: data.petugas.nama,
    jabatan: data.petugas.jabatan,
    perihal: data.perihal,
    tanggal_dinas,
    tanggal_awal_dinas,
    tanggal_akhir_dinas,
    tempat: data.petugas.tempat,
    lama_dinas: `${lama} (${convertTerbilang(lama).toLowerCase()}) hari`,
  };

  const template = readFileSync("./SPPD.docx");
  const buffer = await createReport({
    template,
    data: prop,
    cmdDelimiter: "+++",
  });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="SPPD.docx"',
      "Content-Length": `${buffer.length}`,
    },
    status: 200,
  });
}
