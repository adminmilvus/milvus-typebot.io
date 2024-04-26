import { SignInPage } from '@/features/auth/components/SignInPage'
import { TypebotNotFoundPage } from '@/features/editor/components/TypebotNotFoundPage'
import { useState } from 'react'

export default function Page() {
  const [is404] = useState(process.env.NEXT_PUBLIC_MILVUS_PRODUCTION)

  if (is404) return <TypebotNotFoundPage />

  return <SignInPage type="signin" />
}
