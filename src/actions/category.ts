"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(data: {
  name: string;
  type: string;
}) {
  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
      },
    });

    revalidatePath("/categories");
    revalidatePath("/transactions/new");
    return { success: true, category };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Gagal membuat kategori" };
  }
}
