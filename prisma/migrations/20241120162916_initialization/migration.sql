-- CreateTable
CREATE TABLE "DbAntrean" (
    "id" SERIAL NOT NULL,
    "tanggal" TEXT NOT NULL,
    "noAntrean" TEXT NOT NULL,
    "namaPelanggan" TEXT NOT NULL,
    "namaPesanan" TEXT NOT NULL,
    "kondisi" TEXT,

    CONSTRAINT "DbAntrean_pkey" PRIMARY KEY ("id")
);
