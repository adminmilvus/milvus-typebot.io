import { executeChatwootBlock } from '@/features/blocks/integrations/chatwoot'
import { executeGoogleAnalyticsBlock } from '@/features/blocks/integrations/googleAnalytics'
import { executeGoogleSheetBlock } from '@/features/blocks/integrations/googleSheets'
import { executeSendEmailBlock } from '@/features/blocks/integrations/sendEmail'
import { executeWebhook } from '@/features/blocks/integrations/webhook'
import { IntegrationState } from '@/types'
import { IntegrationBlock } from '@typebot.io/schemas'
import { IntegrationBlockType } from '@typebot.io/schemas/features/blocks/integrations/constants'
import { MilvusBlock } from '@typebot.io/schemas/features/blocks/milvus'
import { MilvusBlockType } from '@typebot.io/schemas/features/blocks/milvus/constants'

export const executeIntegration = ({
  block,
  context,
}: {
  block: IntegrationBlock | MilvusBlock
  context: IntegrationState
}): Promise<string | undefined> | string | undefined => {
  switch (block.type) {
    case IntegrationBlockType.GOOGLE_SHEETS:
      return executeGoogleSheetBlock(block, context)
    case IntegrationBlockType.GOOGLE_ANALYTICS:
      return executeGoogleAnalyticsBlock(block, context)
    case IntegrationBlockType.ZAPIER:
    case IntegrationBlockType.MAKE_COM:
    case IntegrationBlockType.PABBLY_CONNECT:
    case IntegrationBlockType.WEBHOOK:
      return executeWebhook(block, context)
    case IntegrationBlockType.EMAIL:
      return executeSendEmailBlock(block, context)
    case IntegrationBlockType.CHATWOOT:
      return executeChatwootBlock(block, context)
    case MilvusBlockType.CREATE_TICKET:
      return executeWebhook(block, context)
    case MilvusBlockType.BASE_BY_TAG:
      return executeWebhook(block, context)
    case MilvusBlockType.ARTICLE_BY_ID:
      return executeWebhook(block, context)
    case MilvusBlockType.CLIENT_BY_DOCUMENTO:
      return executeWebhook(block, context)
    case MilvusBlockType.CLIENT_BY_EMAIL:
      return executeWebhook(block, context)
    case MilvusBlockType.SPEAK_WITH_ATTENDANT:
      return executeWebhook(block, context)
    case MilvusBlockType.CLOSE_CHAT:
      return executeWebhook(block, context)
    default:
      return
  }
}
