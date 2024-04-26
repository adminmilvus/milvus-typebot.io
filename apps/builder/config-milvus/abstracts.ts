/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpMethod } from '@typebot.io/schemas/features/blocks/integrations/webhook/constants'

interface IRequest {
  method: HttpMethod
  url: string
}

type IHeaders = {
  id: string
  key?: string
  value?: any
}[]

interface IChamado {
  cliente_id?: string
  chamado_descricao?: string
  chamado_assunto?: string
}

interface IBaseConhecimento {
  artigo_id?: string
  tag?: string
}

interface ICliente {
  documento?: string
}

interface IClienteContato {
  email?: string
}

export type {
  IRequest,
  IChamado,
  IBaseConhecimento,
  ICliente,
  IClienteContato,
  IHeaders,
}
