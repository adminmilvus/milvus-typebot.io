import { IRequest } from '../abstracts'
import { HttpMethod } from '@typebot.io/schemas/features/blocks/integrations/webhook/constants'

const requestQueryBase: IRequest = {
  method: HttpMethod.POST,
  url:
    process.env.NEXT_PUBLIC_MILVUS_API_INTEGRACAO +
    'api/typebot/base-conhecimento/artigo',
}

export default requestQueryBase
