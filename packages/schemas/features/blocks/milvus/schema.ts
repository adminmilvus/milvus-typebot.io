import { z } from '../../../zod'
import { httpBlockSchemas } from './webhook_milvus'

export const milvusBlockSchemas = {
  v5: [httpBlockSchemas.v5],
  v6: [httpBlockSchemas.v6],
} as const

const milvusBlockV5Schema = z.discriminatedUnion('type', [
  ...milvusBlockSchemas.v5,
])

const milvusBlockV6Schema = z.discriminatedUnion('type', [
  ...milvusBlockSchemas.v6,
])

const milvusBlockSchema = z.union([milvusBlockV5Schema, milvusBlockV6Schema])

export type MilvusBlock = z.infer<typeof milvusBlockSchema>
export type MilvusBlockV5 = z.infer<typeof milvusBlockV5Schema>
export type MilvusBlockV6 = z.infer<typeof milvusBlockV6Schema>
