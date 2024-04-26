import { Standard } from '@typebot.io/nextjs'
import { useRouter } from 'next/router'
import { SEO } from './Seo'
import { Typebot } from '@typebot.io/schemas/features/typebot/typebot'
import { BackgroundType } from '@typebot.io/schemas/features/typebot/theme/constants'
import { defaultSettings } from '@typebot.io/schemas/features/typebot/settings/constants'
import { Font } from '@typebot.io/schemas'
import { useEffect } from 'react'

export type TypebotV3PageProps = {
  url: string
  name: string
  publicId: string | null
  font: Font | null
  isHideQueryParamsEnabled: boolean | null
  background: NonNullable<Typebot['theme']['general']>['background']
  metadata: Typebot['settings']['metadata']
  chat_id?: string
}

export const TypebotPageV3 = ({
  font,
  publicId,
  name,
  url,
  isHideQueryParamsEnabled,
  metadata,
  background,
  chat_id,
}: TypebotV3PageProps) => {
  const { asPath, push } = useRouter()

  useEffect(() => {
    if (chat_id) {
      localStorage.setItem('milvus-typebot-chat-id', chat_id)
    }
  }, [chat_id])

  const clearQueryParamsIfNecessary = () => {
    const hasQueryParams = asPath.includes('?')
    if (
      !hasQueryParams ||
      !(
        isHideQueryParamsEnabled ??
        defaultSettings.general.isHideQueryParamsEnabled
      )
    )
      return
    push(asPath.split('?')[0], undefined, { shallow: true })
  }

  return (
    <div
      style={{
        height: '100vh',
        // Set background color to avoid SSR flash
        backgroundColor:
          background?.type === BackgroundType.COLOR
            ? background?.content
            : background?.type === BackgroundType.NONE
            ? undefined
            : '#fff',
      }}
    >
      <SEO url={url} typebotName={name} metadata={metadata} />
      <Standard
        typebot={publicId}
        onInit={clearQueryParamsIfNecessary}
        font={font ?? undefined}
      />
    </div>
  )
}
