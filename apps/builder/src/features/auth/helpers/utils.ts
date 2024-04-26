import { User } from '@typebot.io/prisma'

export const getAuthenticatedUser = (): User | undefined => {
  return {
    id: process.env.NEXT_PUBLIC_MILVUS_USER_TYPEBOT_ADMIN_ID || '',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastActivityAt: new Date(),
    name: process.env.NEXT_PUBLIC_MILVUS_USER_TYPEBOT_ADMIN_NAM || '',
    email: process.env.NEXT_PUBLIC_MILVUS_USER_TYPEBOT_ADMIN_EMAIL || '',
    graphNavigation: 'MOUSE',
    onboardingCategories: [],
    emailVerified: new Date(),
    image: '',
    company: '',
    referral: null,
    preferredAppAppearance: null,
    displayedInAppNotifications: null,
  }
}
