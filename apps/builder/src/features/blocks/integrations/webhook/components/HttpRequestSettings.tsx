import React, { useCallback, useEffect, useState } from 'react'
import { Stack } from '@chakra-ui/react'
import { HttpRequest, HttpRequestBlock } from '@typebot.io/schemas'
import { TextInput } from '@/components/inputs'
import { HttpRequestAdvancedConfigForm } from './HttpRequestAdvancedConfigForm'
import { MilvusBlockType } from '@typebot.io/schemas/features/blocks/milvus/constants'
import configCreateTicket from '../../../../../../config-milvus/requests/create_ticket'
import configBaseByTag from '../../../../../../config-milvus/requests/base_by_tag'
import configArticleById from '../../../../../../config-milvus/requests/article_by_id'
import configclientByDocumento from '../../../../../../config-milvus/requests/client_by_documento'
import configClientByEmail from '../../../../../../config-milvus/requests/client_by_email'
import configSpeakWithAttendant from '../../../../../../config-milvus/requests/speack_with_attendant'
import configCloseChat from '../../../../../../config-milvus/requests/close_chat'
import { MilvusBlock } from '@typebot.io/schemas/features/blocks/milvus'
import { createId } from '@paralleldrive/cuid2'
import { useRouter } from 'next/router'
import { IHeaders } from 'config-milvus/abstracts'

type Props = {
  block: HttpRequestBlock | MilvusBlock
  onOptionsChange: (options: HttpRequestBlock['options']) => void
  milvusType?: MilvusBlockType
}

export const HttpRequestSettings = ({
  milvusType,
  block: { id: blockId, options },
  onOptionsChange,
}: Props) => {
  const [url, setUrl] = useState('')
  const [showLabel, setShowLabel] = useState(false)
  const { query } = useRouter()
  const [headers, setHeaders] = useState<IHeaders>()

  const setLocalWebhook = useCallback(
    async (newLocalWebhook: HttpRequest = {}) => {
      onOptionsChange({ ...options, webhook: { ...newLocalWebhook, url } })
    },
    [onOptionsChange, options, url]
  )

  const updateUrl = useCallback(
    async (url: string) => {
      onOptionsChange({ ...options, webhook: { ...options?.webhook, url } })
      setUrl(url)
    },
    [onOptionsChange, options]
  )

  useEffect(() => {
    if (query?.typebotId) {
      const headersLocal: IHeaders = [
        { id: createId(), key: 'Authorization', value: query.typebotId },
      ]
      setHeaders(headersLocal)
    }
  }, [query, query.typebotId])

  useEffect(() => {
    if (milvusType === MilvusBlockType.CREATE_TICKET) {
      updateUrl(configCreateTicket.url)
      setLocalWebhook({
        headers,
        body: options?.webhook?.body,
        method: configCreateTicket.method,
      })
      setShowLabel(false)
      return
    }
    if (milvusType === MilvusBlockType.BASE_BY_TAG) {
      updateUrl(configBaseByTag.url)
      setLocalWebhook({
        headers,
        body: options?.webhook?.body,
        method: configBaseByTag.method,
      })
      setShowLabel(false)
      return
    }
    if (milvusType === MilvusBlockType.ARTICLE_BY_ID) {
      updateUrl(configArticleById.url)
      setLocalWebhook({
        headers,
        body: options?.webhook?.body,
        method: configArticleById.method,
      })
      setShowLabel(false)
      return
    }

    if (milvusType === MilvusBlockType.CLIENT_BY_DOCUMENTO) {
      updateUrl(configclientByDocumento.url)
      setLocalWebhook({
        headers,
        body: options?.webhook?.body,
        method: configclientByDocumento.method,
      })
      setShowLabel(false)
      return
    }

    if (milvusType === MilvusBlockType.CLIENT_BY_EMAIL) {
      updateUrl(configClientByEmail.url)
      setLocalWebhook({
        headers,
        body: options?.webhook?.body,
        method: configClientByEmail.method,
      })
      setShowLabel(false)
      return
    }
    if (milvusType === MilvusBlockType.SPEAK_WITH_ATTENDANT) {
      updateUrl(configSpeakWithAttendant.url)
      setLocalWebhook({
        headers,
        body: options?.webhook?.body,
        method: configSpeakWithAttendant.method,
      })
      setShowLabel(false)
      return
    }
    if (milvusType === MilvusBlockType.CLOSE_CHAT) {
      updateUrl(configCloseChat.url)
      setLocalWebhook({
        headers,
        body: options?.webhook?.body,
        method: configCloseChat.method,
      })
      setShowLabel(false)
      return
    }

    setShowLabel(true)

    if (milvusType && options?.webhook?.url) {
      updateUrl(options.webhook.url)
      setLocalWebhook(options.webhook)
    }
  }, [milvusType, options, setLocalWebhook, updateUrl, headers])

  return (
    <Stack spacing={4}>
      {showLabel && (
        <TextInput
          placeholder="Paste URL..."
          defaultValue={options?.webhook?.url}
          onChange={updateUrl}
          isDisabled={!!milvusType}
        />
      )}
      <HttpRequestAdvancedConfigForm
        blockId={blockId}
        webhook={options?.webhook}
        options={options}
        onWebhookChange={setLocalWebhook}
        onOptionsChange={onOptionsChange}
        milvusType={milvusType}
      />
    </Stack>
  )
}
