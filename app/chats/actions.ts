"use server"

import { prisma } from "@/lib/db"
import { analyzeTranscript } from "@/lib/gemini"
import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"

const ChatSchema = z.object({
  personName: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  chatDate: z.string().min(1, "Date is required"),
  notes: z.string(),
  followUpDate: z.string().optional(),
}).superRefine((data, ctx) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const chatDate = new Date(data.chatDate)

  if (chatDate > today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["chatDate"],
      message: "Chat date cannot be in the future",
    })
  }

  if (data.followUpDate) {
    const followUpDate = new Date(data.followUpDate)
    if (followUpDate <= chatDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["followUpDate"],
        message: "Follow-up date must be after the chat date",
      })
    }
  }
})

export async function createChat(_prevState: unknown, formData: FormData) {
  const { userId } = auth()
  if (!userId) return { error: "Unauthorized" }

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
      userId,
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
  const { userId } = auth()
  if (!userId) return { error: "Unauthorized" }

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
    where: { id, userId },
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

export async function uploadTranscript(id: number, _prevState: unknown, formData: FormData) {
  const { userId } = auth()
  if (!userId) return { error: "Unauthorized" }

  const file = formData.get("transcript")
  if (!(file instanceof File)) return { error: "No file provided" }
  if (!file.name.endsWith(".txt")) return { error: "Only .txt files are supported" }

  const text = await file.text()
  if (text.trim().split(/\s+/).length < 100) {
    return { error: "Transcript too short to analyze (minimum 100 words)" }
  }

  const chat = await prisma.coffeeChat.findUnique({ where: { id, userId } })
  if (!chat) return { error: "Chat not found" }

  let analysis
  try {
    analysis = await analyzeTranscript(text)
  } catch {
    return { error: "Analysis failed — please try again" }
  }

  await prisma.coffeeChat.update({
    where: { id, userId },
    data: {
      transcript: text,
      aiAnalysis: JSON.stringify(analysis),
    },
  })

  revalidatePath(`/chats/${id}`)
  return { success: true }
}

export async function deleteChat(id: number) {
  const { userId } = auth()
  if (!userId) throw new Error("Unauthorized")
  await prisma.coffeeChat.delete({ where: { id, userId } })
  revalidatePath("/chats")
  redirect("/chats")
}
