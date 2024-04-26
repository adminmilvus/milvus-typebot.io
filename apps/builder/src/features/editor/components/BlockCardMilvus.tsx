import React from 'react'
import { BlockIcon } from './BlockIcon'
import { BlockLabel } from './BlockLabel'
import { useTranslate } from '@tolgee/react'
import { MilvusBlockType } from '@typebot.io/schemas/features/blocks/milvus/constants'
import { BlockCardLayoutMilvus } from './BlockCardLayoutMilvus'

type Props = {
  type: MilvusBlockType
  tooltip?: string
  isDisabled?: boolean
  children: React.ReactNode
  onMouseDown: (e: React.MouseEvent, type: MilvusBlockType) => void
}

export const BlockCardMilvus = (
  props: Pick<Props, 'type' | 'onMouseDown'>
): JSX.Element => {
  const { t } = useTranslate()

  switch (props.type) {
    case MilvusBlockType.CREATE_TICKET:
      return (
        <BlockCardLayoutMilvus
          {...props}
          tooltip={t('milvus.label.createTicket')}
        >
          <BlockIcon type={props.type} isGrid={true} />
          <BlockLabel type={props.type} />
        </BlockCardLayoutMilvus>
      )
    case MilvusBlockType.BASE_BY_TAG:
      return (
        <BlockCardLayoutMilvus {...props} tooltip={t('milvus.label.baseByTag')}>
          <BlockIcon type={props.type} isGrid={true} />
          <BlockLabel type={props.type} />
        </BlockCardLayoutMilvus>
      )
    case MilvusBlockType.ARTICLE_BY_ID:
      return (
        <BlockCardLayoutMilvus
          {...props}
          tooltip={t('milvus.label.articleById')}
        >
          <BlockIcon type={props.type} isGrid={true} />
          <BlockLabel type={props.type} />
        </BlockCardLayoutMilvus>
      )
    case MilvusBlockType.CLIENT_BY_DOCUMENTO:
      return (
        <BlockCardLayoutMilvus
          {...props}
          tooltip={t('milvus.label.clientByDocumento')}
        >
          <BlockIcon type={props.type} isGrid={true} />
          <BlockLabel type={props.type} />
        </BlockCardLayoutMilvus>
      )
    case MilvusBlockType.CLIENT_BY_EMAIL:
      return (
        <BlockCardLayoutMilvus
          {...props}
          tooltip={t('milvus.label.clientByEmail')}
        >
          <BlockIcon type={props.type} isGrid={true} />
          <BlockLabel type={props.type} />
        </BlockCardLayoutMilvus>
      )
    case MilvusBlockType.SPEAK_WITH_ATTENDANT:
      return (
        <BlockCardLayoutMilvus
          {...props}
          tooltip={t('milvus.label.speakWithAttendant')}
        >
          <BlockIcon type={props.type} isGrid={true} />
          <BlockLabel type={props.type} />
        </BlockCardLayoutMilvus>
      )
    case MilvusBlockType.CLOSE_CHAT:
      return (
        <BlockCardLayoutMilvus {...props} tooltip={t('milvus.label.closeChat')}>
          <BlockIcon type={props.type} isGrid={true} />
          <BlockLabel type={props.type} />
        </BlockCardLayoutMilvus>
      )
    default:
      return (
        <BlockCardLayoutMilvus {...props}>
          <BlockIcon type={props.type} />
          <BlockLabel type={props.type} />
        </BlockCardLayoutMilvus>
      )
  }
}
