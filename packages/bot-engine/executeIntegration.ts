import { executeSendEmailBlock } from './blocks/integrations/sendEmail/executeSendEmailBlock'
import { executeWebhookBlock } from './blocks/integrations/webhook/executeWebhookBlock'
import { executeChatwootBlock } from './blocks/integrations/chatwoot/executeChatwootBlock'
import { executeGoogleAnalyticsBlock } from './blocks/integrations/legacy/googleAnalytics/executeGoogleAnalyticsBlock'
import { executeGoogleSheetBlock } from './blocks/integrations/googleSheets/executeGoogleSheetBlock'
import { executePixelBlock } from './blocks/integrations/pixel/executePixelBlock'
import { executeZemanticAiBlock } from './blocks/integrations/zemanticAi/executeZemanticAiBlock'
import { IntegrationBlock, SessionState } from '@typebot.io/schemas'
import { ExecuteIntegrationResponse } from './types'
import { IntegrationBlockType } from '@typebot.io/schemas/features/blocks/integrations/constants'
import { executeOpenAIBlock } from './blocks/integrations/legacy/openai/executeOpenAIBlock'
import { executeForgedBlock } from './forge/executeForgedBlock'
import { isNotDefined } from '@typebot.io/lib'
import { env } from '@typebot.io/env'
import { MilvusBlock } from '@typebot.io/schemas/features/blocks/milvus'
import { MilvusBlockType } from '@typebot.io/schemas/features/blocks/milvus/constants'

export const executeIntegration =
  (state: SessionState) =>
  async (
    block: IntegrationBlock | MilvusBlock
  ): Promise<ExecuteIntegrationResponse> => {
    //chat_id is in the state
    switch (block.type) {
      case IntegrationBlockType.GOOGLE_SHEETS:
        return {
          ...(await executeGoogleSheetBlock(state, block)),
          startTimeShouldBeUpdated: true,
        }
      case IntegrationBlockType.CHATWOOT:
        return executeChatwootBlock(state, block)
      case IntegrationBlockType.GOOGLE_ANALYTICS:
        return executeGoogleAnalyticsBlock(state, block)
      case IntegrationBlockType.EMAIL:
        return executeSendEmailBlock(state, block)
      case IntegrationBlockType.ZAPIER:
      case IntegrationBlockType.MAKE_COM:
      case IntegrationBlockType.PABBLY_CONNECT:
        return {
          ...(await executeWebhookBlock(state, block, {
            disableRequestTimeout: true,
          })),
          startTimeShouldBeUpdated: true,
        }
      case IntegrationBlockType.WEBHOOK:
        return {
          ...(await executeWebhookBlock(state, block, {
            disableRequestTimeout: isNotDefined(env.CHAT_API_TIMEOUT),
          })),
        }

      case MilvusBlockType.CREATE_TICKET:
        return {
          ...(await executeWebhookBlock(state, block, {
            disableRequestTimeout: isNotDefined(env.CHAT_API_TIMEOUT),
          })),
        }
      case MilvusBlockType.BASE_BY_TAG:
        return {
          ...(await executeWebhookBlock(state, block, {
            disableRequestTimeout: isNotDefined(env.CHAT_API_TIMEOUT),
          })),
        }
      case MilvusBlockType.ARTICLE_BY_ID:
        return {
          ...(await executeWebhookBlock(state, block, {
            disableRequestTimeout: isNotDefined(env.CHAT_API_TIMEOUT),
          })),
        }
      case MilvusBlockType.CLIENT_BY_DOCUMENTO:
        return {
          ...(await executeWebhookBlock(state, block, {
            disableRequestTimeout: isNotDefined(env.CHAT_API_TIMEOUT),
          })),
        }
      case MilvusBlockType.CLIENT_BY_EMAIL:
        return {
          ...(await executeWebhookBlock(state, block, {
            disableRequestTimeout: isNotDefined(env.CHAT_API_TIMEOUT),
          })),
        }
      case MilvusBlockType.SPEAK_WITH_ATTENDANT:
        return {
          ...(await executeWebhookBlock(state, block, {
            disableRequestTimeout: isNotDefined(env.CHAT_API_TIMEOUT),
          })),
        }
      case MilvusBlockType.CLOSE_CHAT:
        return {
          ...(await executeWebhookBlock(state, block, {
            disableRequestTimeout: isNotDefined(env.CHAT_API_TIMEOUT),
          })),
        }

      case IntegrationBlockType.OPEN_AI:
        return {
          ...(await executeOpenAIBlock(state, block)),
          startTimeShouldBeUpdated: true,
        }
      case IntegrationBlockType.PIXEL:
        return executePixelBlock(state, block)
      case IntegrationBlockType.ZEMANTIC_AI:
        return {
          ...(await executeZemanticAiBlock(state, block)),
          startTimeShouldBeUpdated: true,
        }
      default:
        return {
          ...(await executeForgedBlock(state, block)),
          startTimeShouldBeUpdated: true,
        }
    }
  }
