import { NextApiRequest, NextApiResponse } from 'next'
import {
  badRequest,
  methodNotAllowed,
  notAuthenticated,
} from '@typebot.io/lib/api'
import { generatePresignedPostPolicy } from '@typebot.io/lib/s3/generatePresignedPostPolicy'
import { env } from '@typebot.io/env'
import { getAuthenticatedUser } from '@/features/auth/helpers/utils'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'GET') {
    const user = getAuthenticatedUser()
    if (!user) return notAuthenticated(res)

    if (!env.S3_ENDPOINT || !env.S3_ACCESS_KEY || !env.S3_SECRET_KEY)
      return badRequest(
        res,
        'S3 not properly configured. Missing one of those variables: S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY'
      )
    const filePath = req.query.filePath as string | undefined
    const fileType = req.query.fileType as string | undefined
    if (!filePath || !fileType) return badRequest(res)
    const presignedPostPolicy = await generatePresignedPostPolicy({
      fileType,
      filePath,
    })

    return res.status(200).send({
      presignedUrl: `${presignedPostPolicy.postURL}/${presignedPostPolicy.formData.key}`,
      formData: presignedPostPolicy.formData,
    })
  }
  return methodNotAllowed(res)
}

export default handler
