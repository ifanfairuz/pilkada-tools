import { DateRange } from "react-day-picker";

declare global {
  interface Pegawai {
    no: number;
    jenis: "panwascam" | "pkd" | "sekretariat";
    nip?: string | null;
    nama: string;
    gelar: string;
    jabatan: string;
    devisi: string;
    wilayah: string;
    tempat_lahir: string;
    tgl_lahir: string;
    jk: "L" | "P";
    agama: string;
    kawin: "SUDAH" | "BELUM";
    nik: string;
    nkk: string;
    hp: string;
    email: string;
    alamat: string;
    npwp: string;
    bpjs_kesehatan: string;
    pendidikan: string;
    tahun_lulus_pendidikan: number;
  }

  interface PPK {
    no: number;
    nama: string;
    nip: string;
  }

  interface SuratTugas {
    nomor: string;
    otoritas: "K.JI" | "JI";
    date_create: Date;
    undangan: string;
    perihal: string;
    date: {
      from: Date;
      to?: Date;
    };
    tempat: string;
    petugas: (Pick<Pegawai, "nama" | "jabatan"> & {
      date: DateRange;
      tempat: string;
      asal: string;
    })[];
  }

  interface SuratTugasData {
    nomor: string;
    otoritas_upper: string;
    otoritas_propper: string;
    perihal_propper: string;
    perihal_upper: string;
    nomor_undangan: string;
    kepada: string;
    tanggal_dinas: string;
    tanggal_dinas_upper: string;
    tempat: string;
    tanggal_surat: string;
    nama_ttd: string;
    nip_ttd: string;
    petugas: (Pick<Pegawai, "nama" | "jabatan"> & {
      no: number;
      tanggal_dinas: string;
      tempat: string;
    })[];
  }

  interface SPPD extends Omit<SuratTugas, "petugas"> {
    petugas: Pick<Pegawai, "nama" | "jabatan"> & {
      date: {
        from: Date;
        to?: Date;
      };
      asal: string;
      tempat: string;
    };
    nama_ppk: PPK["nama"];
    nip_ppk: PPK["nip"];
  }

  interface SPPDAll extends Omit<SPPD, "petugas"> {
    petugas: SPPD["petugas"][];
  }

  interface SPPDData {
    nama: string;
    jabatan: string;
    perihal: string;
    tanggal_dinas: string;
    tanggal_awal_dinas: string;
    tanggal_akhir_dinas: string;
    tempat: string;
    asal: string;
    nama_ppk: string;
    nip_ppk: string;
    lama_dinas: string;
  }
}
