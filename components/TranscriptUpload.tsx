"use client"

import { useFormState, useFormStatus } from "react-dom"
import { uploadTranscript } from "@/app/chats/actions"

function UploadButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
    >
      {pending ? "Analyzing…" : "Analyze Transcript"}
    </button>
  )
}

export default function TranscriptUpload({ chatId }: { chatId: number }) {
  const action = uploadTranscript.bind(null, chatId)
  const [state, formAction] = useFormState(action, null)

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">AI Analysis</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Upload a .txt transcript to get coaching feedback on this chat.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="transcript"
          type="file"
          accept=".txt"
          required
          className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
        />

        {state?.error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
            {state.error}
          </p>
        )}

        {state?.success && (
          <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded px-3 py-2">
            Analysis complete — see results below.
          </p>
        )}

        <div>
          <UploadButton />
        </div>
      </form>
    </div>
  )
}
