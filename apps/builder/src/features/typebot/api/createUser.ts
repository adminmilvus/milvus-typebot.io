import prisma from '@typebot.io/lib/prisma'
import { authenticatedProcedure } from '@/helpers/server/trpc'
import { z } from 'zod'
import { GraphNavigation, Plan, WorkspaceRole } from '@typebot.io/prisma'
import { userSchema } from '@typebot.io/schemas'
import { createId } from '@paralleldrive/cuid2'

const userId = createId()
const workspace = {
  id: createId(),
  name: process.env.NEXT_PUBLIC_MILVUS_WORKSPACE_DEFAULT || '',
}
const apiToken = {
  value: createId(),
  name: process.env.NEXT_PUBLIC_MILVUS_API_TOKEN_NAME || '',
}

export const createUser = authenticatedProcedure
  .meta({
    openapi: {
      method: 'POST',
      path: '/v1/typebots/user',
      protect: true,
      summary: 'Create a user',
      tags: ['User'],
    },
  })
  .input(
    z.object({
      workspaceId: z.string(),
    })
  )
  .output(
    z.object({
      user: userSchema.partial(),
      workspaceId: z.string(),
    })
  )
  .mutation(async ({ input: { workspaceId } }) => {
    console.log('workspaceId: ', workspaceId)
    await prisma.workspace.createMany({
      data: [
        {
          id: workspace.id,
          name: workspace.name,
          plan: Plan.PRO,
        },
      ],
    })

    const userNew = await prisma.user.create({
      data: {
        id: userId,
        email: process.env.NEXT_PUBLIC_MILVUS_USER_TYPEBOT_ADMIN_EMAIL,
        name: process.env.NEXT_PUBLIC_MILVUS_USER_TYPEBOT_ADMIN_NAME,
        graphNavigation: GraphNavigation.TRACKPAD,
        onboardingCategories: [],
        apiTokens: {
          createMany: {
            data: [
              {
                name: process.env.NEXT_PUBLIC_MILVUS_API_TOKEN_NAME || '',
                token: apiToken.value,
                createdAt: new Date(),
              },
            ],
          },
        },
      },
      select: { id: true, email: true, name: true },
    })

    await prisma.memberInWorkspace.createMany({
      data: [
        {
          role: WorkspaceRole.ADMIN,
          userId,
          workspaceId: workspace.id,
        },
      ],
    })

    return { user: userNew, workspaceId: workspace.id }
  })
