"use client";

import { propper, cn, formatDateRange, download } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { CalendarIcon, DeleteIcon, PlusIcon } from "lucide-react";

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
        download(res.data, "SPPD.docx");
      })
      .finally(() => {
        setLoading(false);
      });
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
              <FormControl>
                <Input placeholder="Perihal" {...field} />
              </FormControl>
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
                              <p className="font-medium">{v.nama}</p>
                              <p className="text-muted-foreground text-sm">
                                {v.jabatan}
                                {v.date?.from
                                  ? "- " +
                                    formatDateRange(v.date.from, v.date?.to)
                                  : ""}
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
                              variant="outline"
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
                  <div className="flex flex-row gap-2">
                    <div className="flex-1 grid grid-cols-3 gap-2">
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
                      variant="outline"
                      className={cn(
                        "flex h-10 pl-3 text-left font-normal",
                        !petugas.date?.from && "text-muted-foreground"
                      )}
                      onClick={addPetugas}
                    >
                      Add
                      <PlusIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="lg:col-span-6 mt-4 space-x-2">
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
      </form>
    </Form>
  );
}
