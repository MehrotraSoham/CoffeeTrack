import type { ChatAnalysis } from "@/lib/gemini"

const balanceLabel: Record<ChatAnalysis["conversationBalance"], string> = {
  good: "Well balanced",
  talked_too_much: "You talked too much",
  too_quiet: "You were too quiet",
}

const balanceColor: Record<ChatAnalysis["conversationBalance"], string> = {
  good: "text-green-700 bg-green-50 border-green-200",
  talked_too_much: "text-amber-700 bg-amber-50 border-amber-200",
  too_quiet: "text-amber-700 bg-amber-50 border-amber-200",
}

const qualityLabel: Record<ChatAnalysis["questionQuality"], string> = {
  substantive: "Substantive questions",
  mixed: "Mixed question quality",
  surface: "Mostly surface-level questions",
}

const qualityColor: Record<ChatAnalysis["questionQuality"], string> = {
  substantive: "text-green-700 bg-green-50 border-green-200",
  mixed: "text-amber-700 bg-amber-50 border-amber-200",
  surface: "text-red-700 bg-red-50 border-red-200",
}

export default function AnalysisDisplay({ aiAnalysis }: { aiAnalysis: string }) {
  let analysis: ChatAnalysis
  try {
    analysis = JSON.parse(aiAnalysis) as ChatAnalysis
  } catch {
    return (
      <p className="text-sm text-red-600">Could not load analysis — try re-uploading the transcript.</p>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Overall Assessment</h3>
        <p className="text-sm text-gray-700">{analysis.overallAssessment}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded border ${balanceColor[analysis.conversationBalance]}`}>
          {balanceLabel[analysis.conversationBalance]}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded border ${qualityColor[analysis.questionQuality]}`}>
          {qualityLabel[analysis.questionQuality]}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded border ${analysis.nextStepEstablished ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>
          {analysis.nextStepEstablished ? `Next step: ${analysis.nextStep}` : "No clear next step"}
        </span>
      </div>

      {analysis.keyLearnings.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Key Learnings</h3>
          <ul className="list-disc list-inside flex flex-col gap-0.5">
            {analysis.keyLearnings.map((item, i) => (
              <li key={i} className="text-sm text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.coachingTips.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Coaching Tips</h3>
          <ul className="list-disc list-inside flex flex-col gap-0.5">
            {analysis.coachingTips.map((tip, i) => (
              <li key={i} className="text-sm text-gray-700">{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Follow-up Draft</h3>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded p-3 font-sans">
          {analysis.followUpDraft}
        </pre>
      </div>
    </div>
  )
}
