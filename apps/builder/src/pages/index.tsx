import { getAuthenticatedUser } from '@/features/auth/helpers/utils'
import { GetServerSidePropsContext } from 'next'

export default function Page() {
  return null
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const user = getAuthenticatedUser()

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination:
          context.locale !== context.defaultLocale
            ? `/${context.locale}/signin`
            : '/signin',
      },
    }
  }
  return {
    redirect: {
      permanent: false,
      destination:
        context.locale !== context.defaultLocale
          ? `/${context.locale}/typebots`
          : '/typebots',
    },
  }
}
