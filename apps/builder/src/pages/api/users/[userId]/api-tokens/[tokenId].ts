import prisma from '@typebot.io/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { methodNotAllowed, notAuthenticated } from '@typebot.io/lib/api'
import { getAuthenticatedUser } from '@/features/auth/helpers/utils'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = getAuthenticatedUser()
  if (!user) return notAuthenticated(res)

  if (req.method === 'DELETE') {
    const id = req.query.tokenId as string
    const apiToken = await prisma.apiToken.delete({
      where: { id },
    })
    return res.send({ apiToken })
  }
  methodNotAllowed(res)
}

export default handler
