import { NextResponse } from "next/server";
import prisma from "@/app/libs/prisma";

export async function POST(request) {
  const { kondisi, id } = await request.json();
  
  try {
    const updateUser = await prisma.dbAntrean.update({
      where: {
        id: id,
      },
      data: {
        kondisi: kondisi,
      },
    });

    console.log(updateUser);
    if (!updateUser) {
      return NextResponse.json({ status: 500, isUpdate: false }, { status: 500 });
    } else {
      return NextResponse.json({ status: 200, isUpdate: true }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Server error", error: error.message }, { status: 500 });
  }
}
