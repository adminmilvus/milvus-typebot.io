import prisma from '@typebot.io/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { canReadTypebots } from '@/helpers/databaseRules'
import {
  methodNotAllowed,
  notAuthenticated,
  notFound,
} from '@typebot.io/lib/api'
import { getAuthenticatedUser } from '@/features/auth/helpers/utils'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = getAuthenticatedUser()
  if (!user) return notAuthenticated(res)
  if (req.method === 'GET') {
    const typebotId = req.query.typebotId as string
    const typebot = await prisma.typebot.findFirst({
      where: canReadTypebots(typebotId, user),
      select: { groups: true },
    })
    if (!typebot) return notFound(res)
    return res.send({ groups: typebot.groups })
  }
  methodNotAllowed(res)
}

export default handler
