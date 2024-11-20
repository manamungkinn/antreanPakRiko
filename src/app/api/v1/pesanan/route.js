import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { namaPelanggan, namaPesanan,noAntrean,tanggal } = await request.json();
    const data = { namaPelanggan, namaPesanan, noAntrean,tanggal };

    const createCollection = await prisma.dbAntrean.create({ data });
    console.log(data)

    if (!createCollection) {
      return NextResponse.json({ status: 500, isCreated: false }, { status: 500 });
    } else {
      return NextResponse.json({ status: 200, isCreated: true }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
