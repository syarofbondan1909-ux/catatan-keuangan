"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFormData() {
  const wallets = await prisma.wallet.findMany();
  const categories = await prisma.category.findMany();
  return { wallets, categories };
}

export async function createTransaction(data: {
  type: string;
  amount: number;
  walletId: string;
  categoryId?: string;
  toWalletId?: string;
  date: string;
  note?: string;
}) {
  try {
    // 1. Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        walletId: data.walletId,
        categoryId: data.categoryId,
        toWalletId: data.toWalletId,
        date: new Date(data.date),
        note: data.note,
      },
    });

    // 2. Update Wallet Balances
    if (data.type === "expense") {
      await prisma.wallet.update({
        where: { id: data.walletId },
        data: { balance: { decrement: data.amount } },
      });
    } else if (data.type === "income") {
      await prisma.wallet.update({
        where: { id: data.walletId },
        data: { balance: { increment: data.amount } },
      });
    } else if (data.type === "transfer" && data.toWalletId) {
      // Decrease from source
      await prisma.wallet.update({
        where: { id: data.walletId },
        data: { balance: { decrement: data.amount } },
      });
      // Increase destination
      await prisma.wallet.update({
        where: { id: data.toWalletId },
        data: { balance: { increment: data.amount } },
      });
    }

    revalidatePath("/");
    revalidatePath("/wallets");
    revalidatePath("/transactions");
    return { success: true, transaction };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return { success: false, error: "Gagal menyimpan transaksi" };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const tx = await prisma.transaction.findUnique({ where: { id } });
    if (!tx) return { success: false, error: "Transaksi tidak ditemukan" };

    // Reverse balances
    if (tx.type === "expense") {
      await prisma.wallet.update({
        where: { id: tx.walletId },
        data: { balance: { increment: tx.amount } },
      });
    } else if (tx.type === "income") {
      await prisma.wallet.update({
        where: { id: tx.walletId },
        data: { balance: { decrement: tx.amount } },
      });
    } else if (tx.type === "transfer" && tx.toWalletId) {
      await prisma.wallet.update({
        where: { id: tx.walletId },
        data: { balance: { increment: tx.amount } },
      });
      await prisma.wallet.update({
        where: { id: tx.toWalletId },
        data: { balance: { decrement: tx.amount } },
      });
    }

    await prisma.transaction.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/wallets");
    revalidatePath("/transactions");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return { success: false, error: "Gagal menghapus transaksi" };
  }
}
