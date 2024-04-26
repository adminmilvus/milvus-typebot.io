import prisma from '@typebot.io/lib/prisma'
import { publicProcedure } from '@/helpers/server/trpc'
import { TRPCError } from '@trpc/server'
// import { typebotSchema } from '@typebot.io/schemas'
import { z } from 'zod'
// import { isReadTypebotForbidden } from '../helpers/isReadTypebotForbidden'
// import { migrateTypebot } from '@typebot.io/lib/migrations/migrateTypebot'
// import { CollaborationType } from '@typebot.io/prisma'
// import { env } from '@typebot.io/env'

export const getTypebot = publicProcedure
  .meta({
    openapi: {
      method: 'GET',
      path: '/v1/typebots/{typebotId}',
      protect: true,
      summary: 'Get a typebot',
      tags: ['Typebot'],
    },
  })
  .input(
    z.object({
      typebotId: z.string(),
      migrateToLatestVersion: z.boolean().optional().default(false),
    })
  )
  .output(
    z.object({
      typebot: z.any(),
      currentUserMode: z.enum(['guest', 'read', 'write']),
    })
  )
  .query(async ({ input: { typebotId } }) => {
    const existingTypebot = await prisma.typebot.findFirst({
      where: {
        id: typebotId,
      },
      include: {
        collaborators: true,
        workspace: {
          select: {
            isSuspended: true,
            isPastDue: true,
            members: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    })
    if (!existingTypebot?.id)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Typebot not found' })

    return {
      typebot: existingTypebot,
      currentUserMode: 'write',
    }
  })
