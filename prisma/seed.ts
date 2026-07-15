import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Seed Wallets
  const defaultWallet = await prisma.wallet.create({
    data: {
      name: "Xpresi BCA",
      balance: 5000000,
      type: "debit",
    },
  });

  const cashWallet = await prisma.wallet.create({
    data: {
      name: "Cash / Uang Tunai",
      balance: 1000000,
      type: "cash",
    },
  });

  const gopayWallet = await prisma.wallet.create({
    data: {
      name: "Gopay",
      balance: 250000,
      type: "ewallet",
    },
  });

  // 2. Seed Expense Categories
  const expenseCategories = ["Makanan & Minuman", "Transportasi", "Belanja", "Tagihan & Utilitas", "Lainnya"];
  for (const name of expenseCategories) {
    await prisma.category.create({
      data: { name, type: "expense" },
    });
  }

  // 3. Seed Income Categories
  const incomeCategories = ["Gaji", "Bonus", "Investasi", "Lainnya"];
  for (const name of incomeCategories) {
    await prisma.category.create({
      data: { name, type: "income" },
    });
  }
  
  // Transfer Category
  await prisma.category.create({
    data: { name: "Transfer Antar Dompet", type: "transfer" },
  });

  console.log("Database seeded!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
