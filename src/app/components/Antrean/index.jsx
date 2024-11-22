"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const Antrean = ({ dataPelanggan }) => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [created, setIsCreated] = useState(false);
  const [updateAntrean, setUpdateAntrean] = useState(0);
  const buyerName = useRef();
  const orderName = useRef();
  const noAntreanMentah = updateAntrean + 1;
  const noAntrean = noAntreanMentah.toString();
  const route = useRouter();

  function formatToPattern(dateArg, formatString) {
    const date = typeof dateArg === "string" ? new Date(dateArg) : dateArg;
    const zonedDate = date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    return format(zonedDate, formatString);
  }
  //   const tanggal = format(new Date(), "yyyy-MMM-dd");
  const date = new Date();
  // const  tanggal  = formatToPattern(date, "yyyy-MMM-dd");
  const tanggal = "11-11";

  //   const dataPelanggan = data.filter((item) => item.tanggal == tanggal);

  let totalNull = 0;
  for (const data of dataPelanggan) {
    if (data.kondisi == null) {
      totalNull++;
    }
  }

  let totalTrue = 0;
  for (const data of dataPelanggan) {
    if (data.kondisi == "true") {
      totalTrue++;
    }
  }

  let totalFalse = 0;
  for (const data of dataPelanggan) {
    if (data.kondisi == "false") {
      totalFalse++;
    }
  }

  // buat delay
  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handlePesanan = async (e) => {
    e.preventDefault();
    setUpdateAntrean(noAntreanMentah);

    const namaPelanggan = buyerName.current?.value;
    const namaPesanan = orderName.current?.value;

    setIsLoading(true);
    if (!namaPelanggan || !namaPesanan) return;
    try {
      setIsCreated(false);
      const data = { namaPelanggan, namaPesanan, noAntrean, tanggal };
      const response = await fetch("/api/v1/pesanan", { method: "POST", body: JSON.stringify(data) });
      const collection = await response.json();
      console.log({ collection: collection });

      if (collection.isCreated) {
        setIsCreated(true);
      }

      await delay(50);
      setIsLoading(false); // Reset loading state setelah request selesai
    } catch (error) {
      console.log({ error: error.message });
    } finally {
      buyerName.current.value = "";
      orderName.current.value = "";
      route.refresh();
    }
  };

  const updateTrue = async (id) => {
    const data = { id, kondisi: "true" };

    try {
      const response = await fetch("api/v1/updateKondisi", { method: "POST", body: JSON.stringify(data) });
      const update = await response.json();
      console.log(update);
    } catch (error) {
      console.log({ error: error.message });
    } finally {
      route.refresh();
    }
  };
  const updateFalse = async (id) => {
    const data = { id, kondisi: "false" };

    try {
      const response = await fetch("api/v1/updateKondisi", { method: "POST", body: JSON.stringify(data) });
      const update = await response.json();
      console.log(update);
    } catch (error) {
      console.log({ error: error.message });
    } finally {
      route.refresh();
    }
  };

  return (
    <div>
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-10 max-w-xl">
          <div>
            <h1 className="mb-7 text-blue-700 text-sm font-semibold">{tanggal}</h1>
          </div>
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Sistem Antrian</h1>
          <div className="mb-4">
            <input ref={buyerName} type="text" id="buyerName" placeholder="Masukkan Nama Pembeli" className="border border-gray-300 p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300" />
            <input ref={orderName} type="text" id="orderName" placeholder="Masukkan Nama Pesanan" className="border border-gray-300 p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 mt-2" />
            <button type="submit" onClick={handlePesanan} id="addBtn" className="bg-blue-600 text-white p-3 mt-2 rounded-md hover:bg-blue-700 transition duration-300 w-full">
              Tambah Antrian
            </button>
          </div>

          {/* Buat Antrean Yang berlangsung */}
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">Daftar Antrian</h2>
              <span id="totalQueue" className="text-lg font-semibold">
                Total Antrian: {totalNull}
              </span>
            </div>
            {dataPelanggan ? (
              dataPelanggan.map((data, i) => {
                return (
                  <div key={i} className="my-4">
                    {/* buat data antrean sekarang */}
                    {data.kondisi == null ? (
                      <div className={`flex justify-between p-3 rounded items-center ${data.kondisi == "true" ? "bg-green-300" : "bg-blue-500" && data.kondisi == "false" ? "bg-slate-400  line-through " : "bg-blue-500"}`}>
                        <div className="font-normal text-black ">
                          <h1 className="font-bold ">
                            No Antrian : <span className="font-normal">{data.noAntrean}</span>
                          </h1>
                          <h1 className="font-bold ">Nama Pembeli: {data.namaPelanggan}</h1>
                          <h1 className="font-bold "> Pesanan : {data.namaPesanan}</h1>
                        </div>
                        <div>
                          <div>
                            <div>
                              <button
                                className={` text-white p-2 opacity-100 rounded-md ml-4 hover:bg-green-600 transition duration-300 bg-green-500`}
                                onClick={() => {
                                  updateTrue(data.id);
                                }}
                              >
                                Y
                              </button>
                              <button
                                className={` text-white p-2 opacity-100 rounded-md ml-2 hover:bg-red-600 transition duration-300 bg-red-500`}
                                onClick={() => {
                                  updateFalse(data.id);
                                }}
                              >
                                X
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <ul id="queueList" className="list-disc pl-5 font-bold text-blue-200">
                Nothings Here
              </ul>
            )}
          </div>
          {show ? (
            <div>
                <button onClick={()=>{setShow(prev=>!prev)}} className="mt-8 px-3 py-1 hover:bg-green-600 rounded bg-green-700">Hide History</button>
              <div className="mt-10">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Antrian Selesai : {totalTrue}</h2>
                </div>
                <div className="overflow-x-scroll shadow-sm flex w-full scroll-smooth">
                  <div className=" flex max-w-fit place-items-center my-1 px-[1px] gap-2">
                    {dataPelanggan ? (
                      dataPelanggan.map((data, i) => {
                        return (
                          <div key={i} className="my-4">
                            {/* buat data antrean sekarang */}
                            {data.kondisi == "true" ? (
                              <div className={`bg-green-500 p-3 w-[300px]`}>
                                <div className="font-normal text-black ">
                                  <h1 className="font-bold ">
                                    No Antrian : <span className="font-normal">{data.noAntrean}</span>
                                  </h1>
                                  <h1 className="font-bold ">Nama Pembeli: {data.namaPelanggan}</h1>
                                  <h1 className="font-bold "> Pesanan : {data.namaPesanan}</h1>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })
                    ) : (
                      <h1 id="queueList" className="list-disc pl-5 font-bold text-blue-200">
                        Nothings Here
                      </h1>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Ditolak : {totalFalse}</h2>
                </div>
                <div className="overflow-x-scroll shadow-sm flex w-full scroll-smooth">
                  <div className=" flex max-w-fit place-items-center my-1 px-[1px] gap-2">
                    {dataPelanggan
                      ? dataPelanggan.map((data, i) => {
                          return (
                            <div key={i} className="my-4">
                              {/* buat data antrean sekarang */}
                              {data.kondisi == "false" ? (
                                <div className={`bg-red-600 p-3 w-[300px]`}>
                                  <div className="font-normal text-black ">
                                    <h1 className="font-bold ">
                                      No Antrian : <span className="font-normal">{data.noAntrean}</span>
                                    </h1>
                                    <h1 className="font-bold ">Nama Pembeli: {data.namaPelanggan}</h1>
                                    <h1 className="font-bold ">Pesanan : {data.namaPesanan}</h1>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            </div>
          ) : <div><button onClick={()=>{setShow(prev=>!prev)} } className="mt-8 px-3 py-1 hover:bg-green-600 rounded bg-green-700">Show History</button></div>}
        </div>
      </div>
    </div>
  );
};

export default Antrean;
