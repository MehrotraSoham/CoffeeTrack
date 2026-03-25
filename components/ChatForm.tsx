"use client"

import { useFormState, useFormStatus } from "react-dom"
import { createChat, updateChat, deleteChat } from "@/app/chats/actions"
import Link from "next/link"

type ChatFormData = {
  id: number
  personName: string
  company: string
  role: string
  chatDate: string // YYYY-MM-DD
  notes: string
}

type Props = {
  chat?: ChatFormData
  isEdit: boolean
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
    >
      {pending ? "Saving…" : isEdit ? "Save Changes" : "Log Chat"}
    </button>
  )
}

export default function ChatForm({ chat, isEdit }: Props) {
  const action = isEdit && chat
    ? updateChat.bind(null, chat.id)
    : createChat

  const [state, formAction] = useFormState(action, null)

  const deleteAction = isEdit && chat ? deleteChat.bind(null, chat.id) : null

  return (
    <div className="max-w-xl mx-auto">
      <form action={formAction} className="flex flex-col gap-4">
        {state?.error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
            {state.error}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="personName" className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="personName"
            name="personName"
            type="text"
            required
            defaultValue={chat?.personName}
            placeholder="Jane Smith"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="company" className="text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            defaultValue={chat?.company}
            placeholder="Acme Corp"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            id="role"
            name="role"
            type="text"
            required
            defaultValue={chat?.role}
            placeholder="Software Engineer"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="chatDate" className="text-sm font-medium text-gray-700">
            Date of Chat
          </label>
          <input
            id="chatDate"
            name="chatDate"
            type="date"
            required
            defaultValue={chat?.chatDate}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={chat?.notes}
            placeholder="What did you talk about?"
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <SubmitButton isEdit={isEdit} />
          <Link href="/chats" className="text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </Link>
        </div>
      </form>

      {isEdit && deleteAction && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <form action={deleteAction}>
            <button
              type="submit"
              className="text-sm text-red-600 hover:text-red-800 hover:underline"
            >
              Delete this chat
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
