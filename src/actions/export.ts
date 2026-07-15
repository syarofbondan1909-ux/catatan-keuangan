"use server";

import prisma from "@/lib/prisma";

export async function getTransactionsForExport(year: number, month: number) {
  try {
    // month is 1-indexed (1 = January, 12 = December)
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1)); // first day of next month

    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        category: true,
        wallet: true,
        toWallet: true,
      },
      orderBy: {
        date: 'asc'
      }
    });

    return { success: true, data: transactions };
  } catch (error) {
    console.error("Failed to fetch transactions for export:", error);
    return { success: false, error: "Gagal mengambil data transaksi" };
  }
}
