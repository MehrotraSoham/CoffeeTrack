import { prisma } from "@/lib/db"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"

export const dynamic = "force-dynamic"

export default async function ChatsPage() {
  const { userId } = auth()
  const chats = await prisma.coffeeChat.findMany({
    where: { userId: userId! },
    orderBy: { chatDate: "desc" },
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Coffee Chats</h1>
        <Link
          href="/chats/new"
          className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
        >
          + New Chat
        </Link>
      </div>

      {chats.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No chats logged yet.{" "}
          <Link href="/chats/new" className="text-amber-600 hover:underline">
            Log your first one.
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {chats.map((chat) => (
            <li key={chat.id}>
              <Link
                href={`/chats/${chat.id}`}
                className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{chat.personName}</p>
                    <p className="text-sm text-gray-500">
                      {chat.role} · {chat.company}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 shrink-0">
                    {chat.chatDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {chat.notes && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{chat.notes}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
