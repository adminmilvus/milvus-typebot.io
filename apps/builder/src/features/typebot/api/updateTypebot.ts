import prisma from '@typebot.io/lib/prisma'
import { authenticatedProcedure } from '@/helpers/server/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { sanitizeGroups, sanitizeSettings } from '../helpers/sanitizers'
import { Prisma } from '@typebot.io/prisma'

export const updateTypebot = authenticatedProcedure
  .meta({
    openapi: {
      method: 'PATCH',
      path: '/v1/typebots/{typebotId}',
      protect: true,
      summary: 'Update a typebot',
      tags: ['Typebot'],
    },
  })
  .input(
    z.object({
      typebotId: z.string(),
      typebot: z.any(),
    })
  )
  .output(
    z.object({
      typebot: z.any(),
    })
  )
  .mutation(async ({ input: { typebotId, typebot } }) => {
    const existingTypebot = await prisma.typebot.findFirst({
      where: {
        id: typebotId,
      },
      select: {
        version: true,
        id: true,
        customDomain: true,
        publicId: true,
        collaborators: {
          select: {
            userId: true,
            type: true,
          },
        },
        workspace: {
          select: {
            id: true,
            plan: true,
            isSuspended: true,
            isPastDue: true,
            members: {
              select: {
                userId: true,
                role: true,
              },
            },
          },
        },
        updatedAt: true,
      },
    })

    if (!existingTypebot?.id)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Typebot not found',
      })

    const newTypebot = await prisma.typebot.update({
      where: {
        id: existingTypebot.id,
      },
      data: {
        version: typebot.version,
        name: typebot.name,
        icon: typebot.icon,
        selectedThemeTemplateId: typebot.selectedThemeTemplateId,
        events: typebot.events ?? undefined,
        groups: typebot.groups
          ? await sanitizeGroups(existingTypebot.workspace.id)(typebot.groups)
          : undefined,
        theme: typebot.theme ? typebot.theme : undefined,
        settings: typebot.settings
          ? sanitizeSettings(
              typebot.settings,
              existingTypebot.workspace.plan,
              'update'
            )
          : undefined,
        folderId: typebot.folderId,
        variables: typebot.variables,
        edges: typebot.edges,
        resultsTablePreferences:
          typebot.resultsTablePreferences === null
            ? Prisma.DbNull
            : typebot.resultsTablePreferences,
        publicId: typebot.publicId ?? null,
        customDomain: typebot.customDomain ?? null,
        isClosed: typebot.isClosed,
        whatsAppCredentialsId: typebot.whatsAppCredentialsId ?? undefined,
        updatedAt: typebot.updatedAt,
      },
    })

    return { typebot: newTypebot }
  })
