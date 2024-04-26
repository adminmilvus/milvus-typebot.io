import { Tolgee } from '@tolgee/react'
import { FormatIcu } from '@tolgee/format-icu'
import en from '../i18n/en.json'
import pt from '../i18n/pt.json'
import ptBR from '../i18n/pt-BR.json'
import es from '../i18n/es.json'
import { env } from '@typebot.io/env'

export const tolgee = Tolgee()
  .use(FormatIcu())
  .init({
    apiKey: env.NEXT_PUBLIC_TOLGEE_API_KEY,
    apiUrl: env.NEXT_PUBLIC_TOLGEE_API_URL,
    defaultLanguage: 'pt-BR',
    availableLanguages: ['en', 'pt-BR', 'es'],
    fallbackLanguage: 'pt-BR',
    staticData: {
      en,
      pt,
      'pt-BR': ptBR,
      es,
    },
  })
