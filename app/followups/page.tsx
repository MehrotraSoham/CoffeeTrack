import { prisma } from "@/lib/db"
import Link from "next/link"
import { markFollowUpDone } from "./actions"

export const dynamic = "force-dynamic"

export default async function FollowUpsPage() {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const followUps = await prisma.coffeeChat.findMany({
    where: {
      followUpDate: { not: null },
      followUpDone: false,
    },
    orderBy: { followUpDate: "asc" },
  })

  const overdue = followUps.filter((c) => c.followUpDate! < today)
  const upcoming = followUps.filter((c) => c.followUpDate! >= today)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Follow-ups</h1>

      {followUps.length === 0 && (
        <p className="text-gray-500 text-sm">
          No pending follow-ups. Set a follow-up date when{" "}
          <Link href="/chats" className="text-amber-600 hover:underline">
            logging or editing a chat.
          </Link>
        </p>
      )}

      {overdue.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3">
            Overdue
          </h2>
          <ul className="flex flex-col gap-3">
            {overdue.map((chat) => (
              <FollowUpCard key={chat.id} chat={chat} isOverdue />
            ))}
          </ul>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Upcoming
          </h2>
          <ul className="flex flex-col gap-3">
            {upcoming.map((chat) => (
              <FollowUpCard key={chat.id} chat={chat} isOverdue={false} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

type Chat = {
  id: number
  personName: string
  company: string
  role: string
  followUpDate: Date | null
}

function FollowUpCard({ chat, isOverdue }: { chat: Chat; isOverdue: boolean }) {
  const markDone = markFollowUpDone.bind(null, chat.id)

  return (
    <li
      className={`flex items-center justify-between gap-4 border rounded-lg px-5 py-4 ${
        isOverdue
          ? "border-red-200 bg-red-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div>
        <Link
          href={`/chats/${chat.id}`}
          className="font-medium text-gray-900 hover:underline"
        >
          {chat.personName}
        </Link>
        <p className="text-sm text-gray-500">
          {chat.role} · {chat.company}
        </p>
        <p className={`text-sm mt-1 ${isOverdue ? "text-red-600 font-medium" : "text-gray-500"}`}>
          {chat.followUpDate?.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <form action={markDone}>
        <button
          type="submit"
          className="text-sm text-gray-500 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded px-3 py-1.5 transition-colors shrink-0"
        >
          Mark done
        </button>
      </form>
    </li>
  )
}
