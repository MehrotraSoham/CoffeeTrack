import ChatForm from "@/components/ChatForm"
import Link from "next/link"

export default function NewChatPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/chats" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to chats
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-3">Log a Coffee Chat</h1>
      </div>
      <ChatForm isEdit={false} />
    </div>
  )
}
