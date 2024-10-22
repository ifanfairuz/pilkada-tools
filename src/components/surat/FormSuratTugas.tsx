"use client";

import {
  propper,
  cn,
  formatDateRange,
  download,
  capitalize,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import {
  CalendarIcon,
  CaseSensitiveIcon,
  DeleteIcon,
  PlusIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const formSchema = z.object({
  nomor: z.string(),
  otoritas: z.enum(["K.JI", "JI"]),
  date_create: z.date(),
  undangan: z.string(),
  perihal: z.string(),
  date: z.object({
    from: z.date(),
    to: z.optional(z.date()),
  }),
  tempat: z.string(),
  petugas: z
    .array(
      z.object({
        nama: z.string(),
        jabatan: z.string(),
        tempat: z.string(),
        date: z.object({
          from: z.date(),
          to: z.optional(z.date()),
        }),
      })
    )
    .min(1),
});

export function FormSuratTugas({ pegawai }: { pegawai: Pegawai[] }) {
  const form = useForm<SuratTugas>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petugas: [],
      date_create: new Date(),
      date: {
        from: new Date(),
      },
    },
  });
  const [petugas, setPetugas] = useState<SuratTugas["petugas"][0]>({
    nama: "",
    jabatan: "",
    date: form.getValues().date,
    tempat: "",
  });

  const addPetugas = () => {
    form.setValue("petugas", [...form.getValues().petugas, petugas]);
  };
  const delPetugas = (i: number) => {
    let values = form.getValues().petugas;
    values.splice(i, 1);
    form.setValue("petugas", values);
  };

  const [loading, setLoading] = useState(false);
  const onSubmit = () => {
    setLoading(true);
    axios
      .post("/sdmo/surat/generate/surat_tugas", form.getValues(), {
        responseType: "blob",
      })
      .then((res) => {
        download(res.data, "ST.docx");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [loadingSppd, setLoadingSppd] = useState<Record<number, boolean>>({});
  const generateSPPD = (i: number) => {
    setLoadingSppd((d: any) => ({ ...d, [i]: true }));
    const data = form.getValues();
    axios
      .post(
        "/sdmo/surat/generate/sppd",
        { ...data, petugas: data.petugas[i] },
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        download(res.data, "SPPD.docx");
      })
      .finally(() => {
        setLoadingSppd((d: any) => ({ ...d, [i]: false }));
      });
  };

  const generateSPPDAll = () => {
    setLoading(true);

    const data = form.getValues();
    axios
      .post("/sdmo/surat/generate/sppd_all", data, {
        responseType: "blob",
      })
      .then((res) => {
        download(res.data, "SPPD.zip");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const AddAllPanwas = () => {
    const pkds = pegawai
      .filter((p) => p.jenis == "panwascam")
      .map((p) => ({
        ...petugas,
        nama: p.nama,
        jabatan: p.jabatan,
      }));
    form.setValue("petugas", [...form.getValues().petugas, ...pkds]);
  };

  const AddAllPKD = (wilayah: boolean = false) => {
    const pkds = pegawai
      .filter((p) => p.jenis == "pkd")
      .map((p) => ({
        ...petugas,
        nama: p.nama,
        jabatan: propper(p.jabatan),
        tempat: wilayah
          ? p.wilayah
            ? propper(p.wilayah)
            : petugas.tempat
          : petugas.tempat,
      }));
    form.setValue("petugas", [...form.getValues().petugas, ...pkds]);
  };

  const clearPetugas = () => {
    form.setValue("petugas", []);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-auto lg:grid-cols-6 gap-2"
      >
        <FormField
          control={form.control}
          name="nomor"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Nomor</FormLabel>
              <FormControl>
                <Input placeholder="Nomor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="otoritas"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Otoritas</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Otoritas" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="K.JI">KETUA</SelectItem>
                  <SelectItem value="JI">KORSEK</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_create"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Tanggal Surat</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "flex h-10 w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        formatDateRange(field.value, undefined)
                      ) : (
                        <span>Tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="undangan"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Undangan</FormLabel>
              <FormControl>
                <Input placeholder="Undangan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="perihal"
          render={({ field }) => (
            <FormItem className="lg:col-span-6">
              <FormLabel>Perihal</FormLabel>
              <div className="flex flex-row gap-2">
                <FormControl>
                  <Input placeholder="Perihal" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="link"
                  onClick={() =>
                    form.setValue(field.name, capitalize(field.value))
                  }
                >
                  <CaseSensitiveIcon />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Tanggal Dinas</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "flex h-10 w-full pl-3 text-left font-normal",
                        !field.value?.from && "text-muted-foreground"
                      )}
                    >
                      {field.value?.from ? (
                        formatDateRange(field.value.from, field.value.to)
                      ) : (
                        <span>Tanggal Mulai - Tanngal Akhir</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={field.value}
                    onSelect={(v) => {
                      field.onChange(v);
                      setPetugas((p: any) => ({ ...p, date: v }));
                    }}
                    numberOfMonths={2}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tempat"
          render={({ field }) => (
            <FormItem className="lg:col-span-3">
              <FormLabel>Tempat</FormLabel>
              <FormControl>
                <Input
                  placeholder="Tempat"
                  {...field}
                  onChange={(v) => {
                    field.onChange(v.target.value);
                    setPetugas((p: any) => ({ ...p, tempat: v.target.value }));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="petugas"
          render={({ field }) => (
            <FormItem className="lg:col-span-6">
              <FormLabel>Petugas</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    {field.value?.map((v, i) => (
                      <Card
                        key={`${i}`}
                        className="cursor-pointer hover:bg-muted"
                      >
                        <CardContent className="p-2 space-y-2">
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {v.nama}
                                <span className="ml-1 text-muted-foreground">
                                  - {v.jabatan}
                                </span>
                              </p>
                              <p className="text-muted-foreground text-sm divide-x -ml-1">
                                <span className="px-1">
                                  {v.date?.from
                                    ? formatDateRange(v.date.from, v.date?.to)
                                    : ""}
                                </span>
                                <span className="px-1">{v.tempat}</span>
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex h-10 pl-3 text-left font-normal"
                              onClick={() => generateSPPD(i)}
                              loading={loadingSppd[i]}
                            >
                              SPPD
                            </Button>
                            <Button
                              type="button"
                              variant="link"
                              className="flex h-10 pl-3 text-left font-normal"
                              onClick={() => delPetugas(i)}
                            >
                              <DeleteIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex flex-col lg:flex-row gap-2">
                    <div className="flex-1 flex flex-col lg:flex-row gap-2">
                      <Select
                        onValueChange={(val) => {
                          let v = val.split("|");
                          setPetugas((p: any) => ({
                            ...p,
                            nama: v[0],
                            jabatan: propper(v[1]),
                          }));
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Anggota" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pegawai.map((p) => (
                            <SelectItem
                              key={p.no}
                              value={`${p.nama}|${p.jabatan}`}
                            >
                              {p.nama} - {p.jabatan}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "flex h-10 w-full pl-3 text-left font-normal",
                                !petugas.date?.from && "text-muted-foreground"
                              )}
                            >
                              {petugas.date?.from ? (
                                formatDateRange(
                                  petugas.date.from,
                                  petugas.date.to
                                )
                              ) : (
                                <span>Tanggal Mulai - Tanngal Akhir</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={petugas.date}
                            onSelect={(v) =>
                              setPetugas((p: any) => ({ ...p, date: v }))
                            }
                            numberOfMonths={2}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <Input
                        placeholder="Tempat"
                        value={petugas.tempat}
                        onChange={(v) =>
                          setPetugas((p: any) => ({
                            ...p,
                            tempat: v.target.value,
                          }))
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className={cn(
                        "flex h-10 pl-3 text-left font-normal",
                        !petugas.date?.from && "text-muted-foreground"
                      )}
                      onClick={addPetugas}
                    >
                      <PlusIcon className="mr-1 h-4 w-4 opacity-50" />
                      Add
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="lg:col-span-6 mt-4 flex flex-col lg:flex-row justify-between gap-4">
          <div className="inline-block divide-x">
            <Button
              type="button"
              variant="link"
              onClick={AddAllPanwas}
              loading={loading}
            >
              <PlusIcon className="mr-1 h-4 w-4 opacity-50" />
              Panwas
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => {
                AddAllPKD();
              }}
              loading={loading}
            >
              <PlusIcon className="mr-1 h-4 w-4 opacity-50" />
              PKD Tempat Sama
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => {
                AddAllPKD(true);
              }}
              loading={loading}
            >
              <PlusIcon className="mr-1 h-4 w-4 opacity-50" />
              PKD Tempat Masing2
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={clearPetugas}
              loading={loading}
            >
              Clear
            </Button>
          </div>
          <div className="flex space-x-2 lg:order-first">
            <Button type="submit" loading={loading}>
              Surat Tugas
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={generateSPPDAll}
              loading={loading}
            >
              SPPD All
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
