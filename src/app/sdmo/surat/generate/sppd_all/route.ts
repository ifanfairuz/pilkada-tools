import { convertTerbilang, formatDateRange, lamaPerdin } from "@/lib/utils";
import { readFileSync } from "fs";
import createReport from "docx-templates";
import DocxMerger from "docx-merger";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  const data: SPPDAll = await request.json();
  const template = readFileSync("./SPPD.docx");

  const sppdAll = await Promise.all(
    data.petugas.map((p) => {
      const d: SPPD = {
        ...data,
        petugas: p,
      };

      return generate(d, template).then((res) =>
        Buffer.from(res).toString("binary")
      );
    })
  );

  const sppd = new DocxMerger({}, sppdAll);
  const buffer = await new Promise<Buffer>((resolve) => {
    sppd.save("nodebuffer", resolve);
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

async function generate(data: SPPD, template: Buffer) {
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

  return await createReport({
    template,
    data: prop,
    cmdDelimiter: "+++",
  });
}
