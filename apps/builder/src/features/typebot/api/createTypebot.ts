import prisma from '@typebot.io/lib/prisma'
import { authenticatedProcedure } from '@/helpers/server/trpc'
import { TypebotV6, typebotV6Schema } from '@typebot.io/schemas'
import { z } from 'zod'
import { sanitizeGroups } from '../helpers/sanitizers'
import { createId } from '@paralleldrive/cuid2'
import { EventType } from '@typebot.io/schemas/features/events/constants'
import { trackEvents } from '@typebot.io/lib/telemetry/trackEvents'

const typebotCreateSchemaPick = {
  name: true,
  icon: true,
  selectedThemeTemplateId: true,
  groups: true,
  events: true,
  theme: true,
  settings: true,
  folderId: true,
  variables: true,
  edges: true,
  resultsTablePreferences: true,
  publicId: true,
  customDomain: true,
} as const

export const createTypebot = authenticatedProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/v1/typebots',
      protect: true,
      summary: 'Create a typebot',
      tags: ['Typebot'],
    },
  })
  .input(
    z.object({
      workspaceId: z.string(),
      typebot: typebotV6Schema.pick(typebotCreateSchemaPick).partial(),
    })
  )
  .output(
    z.object({
      typebot: typebotV6Schema,
    })
  )
  .mutation(async ({ input: { typebot, workspaceId }, ctx: { user } }) => {
    const newTypebot = await prisma.typebot.create({
      data: {
        version: '6',
        workspaceId,
        name: typebot.name ?? 'My typebot',
        icon: typebot.icon,
        selectedThemeTemplateId: typebot.selectedThemeTemplateId,
        groups: (typebot.groups
          ? await sanitizeGroups(workspaceId)(typebot.groups)
          : []) as TypebotV6['groups'],
        events: typebot.events ?? [
          {
            type: EventType.START,
            graphCoordinates: { x: 0, y: 0 },
            id: createId(),
          },
        ],
        theme: typebot.theme ? typebot.theme : {},
        settings: {},
        folderId: null,
        variables: typebot.variables ?? [],
        edges: typebot.edges ?? [],
        resultsTablePreferences: typebot.resultsTablePreferences ?? undefined,
        publicId: typebot.publicId ?? undefined,
        customDomain: typebot.customDomain ?? undefined,
      } satisfies Partial<TypebotV6>,
    })

    const parsedNewTypebot = typebotV6Schema.parse(newTypebot)

    await trackEvents([
      {
        name: 'Typebot created',
        workspaceId: parsedNewTypebot.workspaceId,
        typebotId: parsedNewTypebot.id,
        userId: user.id,
        data: {
          name: newTypebot.name,
        },
      },
    ])

    return { typebot: parsedNewTypebot }
  })
