"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWallet(data: {
  name: string;
  type: string;
  initialBalance: number;
}) {
  try {
    const wallet = await prisma.wallet.create({
      data: {
        name: data.name,
        type: data.type,
        balance: data.initialBalance,
      },
    });

    // Option: If initialBalance > 0, we could automatically create an "Initial Balance" income transaction
    // But for simplicity, we just set the wallet balance as requested.
    if (data.initialBalance > 0) {
      // Find or create an income category for initial balance
      let category = await prisma.category.findFirst({
        where: { name: "Saldo Awal", type: "income" }
      });
      
      if (!category) {
        category = await prisma.category.create({
          data: { name: "Saldo Awal", type: "income" }
        });
      }

      await prisma.transaction.create({
        data: {
          type: "income",
          amount: data.initialBalance,
          walletId: wallet.id,
          categoryId: category.id,
          date: new Date(),
          note: "Setoran saldo awal pembuatan dompet",
        }
      });
    }

    revalidatePath("/");
    revalidatePath("/wallets");
    revalidatePath("/transactions");
    
    return { success: true, wallet };
  } catch (error) {
    console.error("Failed to create wallet:", error);
    return { success: false, error: "Gagal membuat dompet" };
  }
}
