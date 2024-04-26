import { getAuthenticatedUser } from '@/features/auth/helpers/utils'
import prisma from '@typebot.io/lib/prisma'
import { trackEvents } from '@typebot.io/lib/telemetry/trackEvents'
import { User } from '@typebot.io/schemas'
import { GetServerSidePropsContext } from 'next'

export const trackAnalyticsPageView = async (
  context: GetServerSidePropsContext
) => {
  const user = getAuthenticatedUser()
  const typebotId = context.params?.typebotId as string | undefined
  if (!typebotId) return
  const typebot = await prisma.typebot.findUnique({
    where: { id: typebotId },
    select: { workspaceId: true },
  })
  if (!typebot) return

  await trackEvents([
    {
      name: 'Analytics visited',
      typebotId,
      userId: (user as User).id,
      workspaceId: typebot.workspaceId,
    },
  ])
}
