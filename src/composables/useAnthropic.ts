import Anthropic from '@anthropic-ai/sdk'
import { useSettingsStore } from '@/stores/settings'
import { useChatStore } from '@/stores/chat'
import { useBoardStore } from '@/stores/board'
import { useCanvasStore } from '@/stores/canvas'
import { buildBoardSummary } from '@/lib/boardSummary'
import { snapshotToBase64 } from '@/composables/useCanvasExport'

const SYSTEM_PROMPT = `You are a friendly, sharp product co-designer embedded in a productivity app.
The user manages tasks on a Todo / In Progress / Done kanban board and sketches ideas on a drawing canvas.
You may be given an image of their current drawing and/or a text summary of their board.
Help them think: critique and improve their sketches, suggest concrete design refinements,
break ideas into actionable kanban tasks, and brainstorm. Be concise, specific, and encouraging.
When you reference the drawing, describe what you actually see.`

function createClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}

function errorMessage(err: unknown): string {
  if (err instanceof Anthropic.APIError) {
    if (err.status === 401) return '⚠️ Invalid API key. Check it in Settings.'
    if (err.status === 429) return '⚠️ Rate limited. Please wait a moment and try again.'
    return `⚠️ API error (${err.status ?? 'unknown'}): ${err.message}`
  }
  if (err instanceof Error) return `⚠️ ${err.message}`
  return '⚠️ Something went wrong talking to Claude.'
}

export function useAnthropic() {
  const settings = useSettingsStore()
  const chat = useChatStore()
  const board = useBoardStore()
  const canvas = useCanvasStore()

  async function send(userText: string) {
    const text = userText.trim()
    if (!text || chat.isLoading) return
    if (!settings.hasKey) {
      chat.addMessage('assistant', '⚠️ Add your Anthropic API key in Settings first.', {
        isError: true,
      })
      return
    }

    // Snapshot prior turns (text-only) before adding the new ones.
    const priorTurns = chat.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    // Build the rich content for this user turn.
    const content: Anthropic.MessageParam['content'] = []
    let attachedCanvas = false

    if (chat.includeCanvas && canvas.hasDrawing) {
      const base64 = await snapshotToBase64(canvas.snapshotJson)
      if (base64) {
        content.push({
          type: 'image',
          source: { type: 'base64', media_type: 'image/png', data: base64 },
        })
        attachedCanvas = true
      }
    }
    if (chat.includeBoard) {
      content.push({ type: 'text', text: buildBoardSummary(board.columns) })
    }
    content.push({ type: 'text', text })

    chat.addMessage('user', text, { hadCanvas: attachedCanvas })
    const assistantId = chat.addMessage('assistant', '')
    chat.setLoading(true)

    try {
      const client = createClient(settings.apiKey)
      const stream = client.messages.stream({
        model: settings.model,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [...priorTurns, { role: 'user', content }],
      })
      stream.on('text', (delta) => chat.appendToMessage(assistantId, delta))
      await stream.finalMessage()
    } catch (err) {
      chat.setMessageContent(assistantId, errorMessage(err), true)
    } finally {
      chat.setLoading(false)
    }
  }

  /** Lightweight key check used by the Settings "Verify" button. */
  async function verifyKey(apiKey: string, model: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const client = createClient(apiKey)
      await client.messages.create({
        model,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'Hi' }],
      })
      return { ok: true }
    } catch (err) {
      return { ok: false, error: errorMessage(err) }
    }
  }

  return { send, verifyKey }
}
