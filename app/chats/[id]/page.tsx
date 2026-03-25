import { prisma } from "@/lib/db"
import ChatForm from "@/components/ChatForm"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: { id: string }
}

export default async function EditChatPage({ params }: Props) {
  const id = parseInt(params.id, 10)

  if (isNaN(id)) notFound()

  const chat = await prisma.coffeeChat.findUnique({ where: { id } })

  if (!chat) notFound()

  const chatData = {
    id: chat.id,
    personName: chat.personName,
    company: chat.company,
    role: chat.role,
    chatDate: chat.chatDate.toISOString().split("T")[0],
    notes: chat.notes,
    followUpDate: chat.followUpDate
      ? chat.followUpDate.toISOString().split("T")[0]
      : undefined,
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/chats" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to chats
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-3">Edit Chat</h1>
        <p className="text-sm text-gray-500 mt-1">
          {chat.personName} · {chat.company}
        </p>
      </div>
      <ChatForm chat={chatData} isEdit={true} />
    </div>
  )
}
