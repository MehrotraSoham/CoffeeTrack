import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold text-gray-900">CoffeeTrack</h1>
      <p className="text-gray-500 text-sm text-center max-w-sm">
        Log your coffee chats, track follow-ups, and stay on top of your networking.
      </p>
      <Link
        href="/chats"
        className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2.5 rounded transition-colors"
      >
        View Coffee Chats
      </Link>
    </div>
  )
}
