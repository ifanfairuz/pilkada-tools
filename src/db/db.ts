import { JSONFileSyncPreset } from "lowdb/node";
import path from "path";
import { cache } from "react";

const initial = require("./initial.json");
export const db = JSONFileSyncPreset<DatabaseScheme>(
  path.join("db.json"),
  initial
);

export const getKomisioner = cache(() => {
  return db.data.anggota.filter((a) => a.jenis === "panwascam");
});
export const getSekretariat = cache(() => {
  return db.data.anggota.filter((a) => a.jenis === "sekretariat");
});
export const getPkd = cache(() => {
  return db.data.anggota.filter((a) => a.jenis === "pkd");
});
export const getKetua = cache(() => {
  return db.data.anggota.find((a) => a.jabatan === "KETUA")!;
});
export const getKorSek = cache(() => {
  return db.data.anggota.find((a) => a.jabatan === "KEPALA SEKRETARIAT")!;
});
