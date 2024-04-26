import { IRequest } from '../abstracts'
import { HttpMethod } from '@typebot.io/schemas/features/blocks/integrations/webhook/constants'

const requestCoseChat: IRequest = {
  method: HttpMethod.POST,
  url:
    process.env.NEXT_PUBLIC_MILVUS_API_INTEGRACAO + 'api/typebot/fechar-chat',
}

export default requestCoseChat
