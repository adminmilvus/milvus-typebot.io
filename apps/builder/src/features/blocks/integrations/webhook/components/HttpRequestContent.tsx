import { Stack, Text } from '@chakra-ui/react'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { HttpRequestBlock } from '@typebot.io/schemas'
import { SetVariableLabel } from '@/components/SetVariableLabel'
import { MilvusBlock } from '@typebot.io/schemas/features/blocks/milvus'
import { MilvusBlockType } from '@typebot.io/schemas/features/blocks/milvus/constants'
import { useEffect, useState } from 'react'
import { useTranslate } from '@tolgee/react'

type Props = {
  block: HttpRequestBlock | MilvusBlock
  type?: MilvusBlockType
}

export const WebhookContent = ({ block: { options }, type }: Props) => {
  const { typebot } = useTypebot()
  const webhook = options?.webhook
  const { t } = useTranslate()
  const [label, setLabel] = useState<string>('')

  useEffect(() => {
    if (type === MilvusBlockType.CREATE_TICKET) {
      return setLabel(t('milvus.label.createTicket'))
    }
    if (type === MilvusBlockType.BASE_BY_TAG) {
      return setLabel(t('milvus.label.baseByTag'))
    }
    if (type === MilvusBlockType.ARTICLE_BY_ID) {
      return setLabel(t('milvus.label.articleById'))
    }
    if (type === MilvusBlockType.CLIENT_BY_DOCUMENTO) {
      return setLabel(t('milvus.label.clientByDocumento'))
    }
    if (type === MilvusBlockType.CLIENT_BY_EMAIL) {
      return setLabel(t('milvus.label.clientByEmail'))
    }
    if (type === MilvusBlockType.SPEAK_WITH_ATTENDANT) {
      return setLabel(t('milvus.label.speakWithAttendant'))
    }
    if (type === MilvusBlockType.CLOSE_CHAT) {
      return setLabel(t('milvus.label.closeChat'))
    }
    if (webhook) {
      setLabel(`${webhook.method || ''} ${webhook.url || ''}`)
    }
  }, [t, type, webhook])

  if (!webhook?.url) return <Text color="gray.500">Configure...</Text>
  return (
    <Stack w="full">
      <Text noOfLines={2} pr="6">
        {label}
      </Text>
      {options?.responseVariableMapping
        ?.filter((mapping) => mapping.variableId)
        .map((mapping) => (
          <SetVariableLabel
            key={mapping.variableId}
            variableId={mapping.variableId as string}
            variables={typebot?.variables}
          />
        ))}
    </Stack>
  )
}
