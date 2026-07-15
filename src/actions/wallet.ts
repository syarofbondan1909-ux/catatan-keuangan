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

export async function deleteWallet(id: string) {
  try {
    const transfersOut = await prisma.transaction.findMany({
      where: { walletId: id, type: "transfer", toWalletId: { not: null } }
    });
    for (const t of transfersOut) {
      if (t.toWalletId) {
        await prisma.wallet.update({
          where: { id: t.toWalletId },
          data: { balance: { decrement: t.amount } }
        });
      }
    }

    const transfersIn = await prisma.transaction.findMany({
      where: { toWalletId: id, type: "transfer" }
    });
    for (const t of transfersIn) {
      await prisma.wallet.update({
        where: { id: t.walletId },
        data: { balance: { increment: t.amount } }
      });
    }

    await prisma.transaction.deleteMany({
      where: {
        OR: [
          { walletId: id },
          { toWalletId: id }
        ]
      }
    });

    await prisma.wallet.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/wallets");
    revalidatePath("/transactions");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete wallet:", error);
    return { success: false, error: "Gagal menghapus dompet" };
  }
}
