"use server";

import prisma from "@/lib/prisma";
import { setTelegramWebhook, sendTelegramMessage } from "@/lib/telegram";
import { revalidatePath } from "next/cache";

export async function saveTelegramChatId(chatId: string) {
  try {
    await prisma.user.upsert({
      where: { id: "global" },
      update: { telegramChatId: chatId },
      create: { id: "global", telegramChatId: chatId }
    });

    // Send a welcome message
    await sendTelegramMessage(chatId, "🎉 Selamat! Aplikasi Catatan Keuangan Anda telah berhasil dihubungkan dengan Telegram.\n\nAnda sekarang dapat mencatat transaksi langsung dari sini. Coba ketik:\n\nkeluar 50000 makan siang");

    revalidatePath("/settings/integrations");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving chat ID:", error);
    return { success: false, error: error.message };
  }
}

export async function setupWebhook(originUrl: string) {
  try {
    const webhookUrl = `${originUrl}/api/telegram`;
    const result = await setTelegramWebhook(webhookUrl);
    
    if (result.success) {
      return { success: true, message: `Webhook berhasil diatur ke: ${webhookUrl}` };
    } else {
      return { success: false, error: result.error || result.description };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTelegramStatus() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: "global" }
    });
    return { connected: !!user?.telegramChatId, chatId: user?.telegramChatId || "" };
  } catch {
    return { connected: false, chatId: "" };
  }
}

export async function disconnectTelegram() {
  try {
    await prisma.user.update({
      where: { id: "global" },
      data: { telegramChatId: null }
    });
    revalidatePath("/settings/integrations");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
