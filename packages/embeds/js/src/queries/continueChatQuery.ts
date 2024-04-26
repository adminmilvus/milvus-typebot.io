import { guessApiHost } from '@/utils/guessApiHost'
import { isNotEmpty } from '@typebot.io/lib'
import { ContinueChatResponse } from '@typebot.io/schemas'
import ky from 'ky'

export const continueChatQuery = async ({
  apiHost,
  message,
  sessionId,
}: {
  apiHost?: string
  message: string | undefined
  sessionId: string
}) => {
  try {
    const chat_id = localStorage.getItem('milvus-typebot-chat-id') ?? undefined

    const data = await ky
      .post(
        `${
          isNotEmpty(apiHost) ? apiHost : guessApiHost()
        }/api/v1/sessions/${sessionId}/continueChat`,
        {
          json: {
            message,
            chat_id,
          },
          timeout: false,
        }
      )
      .json<ContinueChatResponse>()

    return { data }
  } catch (error) {
    return { error }
  }
}
