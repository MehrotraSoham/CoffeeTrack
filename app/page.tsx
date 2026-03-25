import { prisma } from "@/lib/db"
import Link from "next/link"

export default async function DashboardPage() {
  const now = new Date()

  // Last 6 months (including current month)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  const [totalChats, recentChats, pendingFollowUps, doneFollowUps] =
    await Promise.all([
      prisma.coffeeChat.count(),
      prisma.coffeeChat.findMany({
        where: { chatDate: { gte: sixMonthsAgo } },
        select: { chatDate: true },
      }),
      prisma.coffeeChat.count({
        where: { followUpDate: { not: null }, followUpDone: false },
      }),
      prisma.coffeeChat.count({
        where: { followUpDate: { not: null }, followUpDone: true },
      }),
    ])

  // Build month buckets for the last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return {
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      year: d.getFullYear(),
      month: d.getMonth(),
      count: 0,
    }
  })

  for (const { chatDate } of recentChats) {
    const bucket = months.find(
      (m) => m.year === chatDate.getFullYear() && m.month === chatDate.getMonth()
    )
    if (bucket) bucket.count++
  }

  const maxCount = Math.max(...months.map((m) => m.count), 1)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Chats" value={totalChats} />
        <StatCard label="Follow-ups Pending" value={pendingFollowUps} />
        <StatCard label="Follow-ups Done" value={doneFollowUps} />
      </div>

      {/* Chats per month */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 pt-6 pb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-6">
          Chats per Month
        </h2>
        <div className="flex items-end gap-3 h-32">
          {months.map((m) => (
            <div key={m.label} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs text-gray-500">{m.count > 0 ? m.count : ""}</span>
              <div
                className="w-full bg-amber-400 rounded-t"
                style={{
                  height: `${Math.max((m.count / maxCount) * 100, m.count > 0 ? 4 : 0)}%`,
                  minHeight: m.count > 0 ? "4px" : "0",
                }}
              />
              <span className="text-xs text-gray-400">{m.label}</span>
            </div>
          ))}
        </div>
        {totalChats === 0 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            No chats yet.{" "}
            <Link href="/chats/new" className="text-amber-600 hover:underline">
              Log your first one.
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-5">
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}
