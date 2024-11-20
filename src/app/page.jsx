import Image from "next/image";
import Antrean from "./components/Antrean";
import prisma from "./libs/prisma";

const Page=async()=> {
  const dataPelanggan = await prisma.dbAntrean.findMany();

  return (
    <div>
      <Antrean data={dataPelanggan}/>
    </div>
  );
}

export default Page