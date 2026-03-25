"use server"

import { prisma } from "@/lib/db"
import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const ChatSchema = z.object({
  personName: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  chatDate: z.string().min(1, "Date is required"),
  notes: z.string(),
  followUpDate: z.string().optional(),
})

export async function createChat(_prevState: unknown, formData: FormData) {
  const parsed = ChatSchema.safeParse({
    personName: formData.get("personName"),
    company: formData.get("company"),
    role: formData.get("role"),
    chatDate: formData.get("chatDate"),
    notes: formData.get("notes") ?? "",
    followUpDate: formData.get("followUpDate") || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { personName, company, role, chatDate, notes, followUpDate } = parsed.data

  await prisma.coffeeChat.create({
    data: {
      personName,
      company,
      role,
      chatDate: new Date(chatDate),
      notes,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
    },
  })

  revalidatePath("/chats")
  redirect("/chats")
}

export async function updateChat(id: number, _prevState: unknown, formData: FormData) {
  const parsed = ChatSchema.safeParse({
    personName: formData.get("personName"),
    company: formData.get("company"),
    role: formData.get("role"),
    chatDate: formData.get("chatDate"),
    notes: formData.get("notes") ?? "",
    followUpDate: formData.get("followUpDate") || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { personName, company, role, chatDate, notes, followUpDate } = parsed.data

  await prisma.coffeeChat.update({
    where: { id },
    data: {
      personName,
      company,
      role,
      chatDate: new Date(chatDate),
      notes,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
    },
  })

  revalidatePath("/chats")
  revalidatePath(`/chats/${id}`)
  redirect("/chats")
}

export async function deleteChat(id: number) {
  await prisma.coffeeChat.delete({ where: { id } })
  revalidatePath("/chats")
  redirect("/chats")
}
