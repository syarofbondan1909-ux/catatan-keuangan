import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Check if it's a message
    if (!body.message) {
      return NextResponse.json({ success: true });
    }

    const chatId = body.message.chat.id.toString();
    const text = body.message.text || "";

    // 1. Handle /start (Send Chat ID)
    if (text.startsWith("/start")) {
      await sendTelegramMessage(
        chatId, 
        `Halo! Chat ID Anda adalah: ${chatId}\n\nSilakan salin ID ini dan tempelkan ke aplikasi Catatan Keuangan Anda di menu Integrasi Chat untuk menghubungkan bot ini.`
      );
      return NextResponse.json({ success: true });
    }

    // 2. Check if user is registered in DB
    const user = await prisma.user.findFirst({
      where: { telegramChatId: chatId }
    });

    if (!user) {
      await sendTelegramMessage(
        chatId, 
        `Maaf, Anda belum menghubungkan aplikasi Anda dengan Bot ini.\n\nKirim /start untuk melihat Chat ID Anda, lalu masukkan ke dalam aplikasi Catatan Keuangan Anda.`
      );
      return NextResponse.json({ success: true });
    }

    // 3. Parse Natural Language Input for Transaction
    // Example format: "keluar 50000 makan siang" or "masuk 1000000 gaji"
    const lowerText = text.toLowerCase().trim();
    const isExpense = lowerText.startsWith("keluar");
    const isIncome = lowerText.startsWith("masuk");

    if (!isExpense && !isIncome) {
      await sendTelegramMessage(
        chatId, 
        `Perintah tidak dikenali.\n\nGunakan format:\n- Keluar [Nominal] [Keterangan]\n- Masuk [Nominal] [Keterangan]\n\nContoh:\nkeluar 50000 makan siang`
      );
      return NextResponse.json({ success: true });
    }

    const parts = text.split(" ");
    if (parts.length < 2) {
      await sendTelegramMessage(chatId, `Format salah. Harap sertakan nominal.`);
      return NextResponse.json({ success: true });
    }

    const amountStr = parts[1].replace(/[^0-9]/g, ""); // extract numbers only
    const amount = Number(amountStr);
    
    if (isNaN(amount) || amount <= 0) {
      await sendTelegramMessage(chatId, `Nominal tidak valid.`);
      return NextResponse.json({ success: true });
    }

    const note = parts.slice(2).join(" ") || undefined;
    const type = isExpense ? "expense" : "income";

    // 4. Find Default Wallet & Category
    // We'll just use the first available wallet, or cash/debit if possible
    const wallet = await prisma.wallet.findFirst({
      orderBy: { createdAt: 'asc' }
    });

    if (!wallet) {
      await sendTelegramMessage(chatId, `Gagal mencatat: Anda belum memiliki dompet/rekening di aplikasi.`);
      return NextResponse.json({ success: true });
    }

    const category = await prisma.category.findFirst({
      where: { type: type },
      orderBy: { name: 'asc' }
    });

    // 5. Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        type: type,
        amount: amount,
        note: note,
        walletId: wallet.id,
        categoryId: category?.id,
        date: new Date()
      }
    });

    // 6. Update Wallet Balance
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: isExpense ? wallet.balance - amount : wallet.balance + amount
      }
    });

    // 7. Send Success Notification
    const formatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
    const successMsg = `✅ Berhasil dicatat!\n\n` +
      `Tipe: ${isExpense ? 'Pengeluaran' : 'Pemasukan'}\n` +
      `Nominal: ${formatter.format(amount)}\n` +
      `Keterangan: ${note || '-'}\n` +
      `Dompet: ${wallet.name}`;

    await sendTelegramMessage(chatId, successMsg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
