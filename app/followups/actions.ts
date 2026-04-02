"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

export async function markFollowUpDone(id: number) {
  const { userId } = auth()
  if (!userId) throw new Error("Unauthorized")
  await prisma.coffeeChat.update({
    where: { id, userId },
    data: { followUpDone: true },
  })
  revalidatePath("/followups")
}
