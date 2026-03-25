"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function markFollowUpDone(id: number) {
  await prisma.coffeeChat.update({
    where: { id },
    data: { followUpDone: true },
  })
  revalidatePath("/followups")
}
