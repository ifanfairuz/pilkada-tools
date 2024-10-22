import {
  convertTerbilang,
  formatDateRange,
  getTemplate,
  lamaPerdin,
} from "@/lib/utils";
import createReport from "docx-templates";
import JSZip from "jszip";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  const data: SPPDAll = await request.json();
  const template = await getTemplate("/SPPD.docx");

  const sppdAll = await Promise.all(
    data.petugas.map(async (p, i) => {
      const d: SPPD = {
        ...data,
        petugas: p,
      };

      return {
        name: `${i + 1} ${p.nama}`,
        data: await generate(d, template),
      };
    })
  );

  const zip = new JSZip();
  await Promise.all(
    sppdAll.map((sppd) =>
      zip.file(`SPPD - ${sppd.name}.docx`, sppd.data, { binary: true })
    )
  );
  return await zip
    .generateAsync({ type: "nodebuffer", streamFiles: true })
    .then(
      (buffer) =>
        new Response(buffer, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": 'attachment; filename="SPPD.zip"',
            "Content-Length": `${buffer.length}`,
          },
          status: 200,
        })
    );
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
