import { EditorPage } from '@/features/editor/components/EditorPage'
import { useEffect, useState } from 'react'
import { useTolgee } from '@tolgee/react'
import { HStack, Spinner } from '@chakra-ui/react'

export default function Page() {
  const { changeLanguage } = useTolgee()
  const [isLoaded, setIsLoaded] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (process.env.NEXT_PUBLIC_MILVUS_IDIOMA) {
        changeLanguage(process.env.NEXT_PUBLIC_MILVUS_IDIOMA)
        setIsLoaded(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [changeLanguage])

  if (isLoaded) {
    return (
      <HStack w="full" h="full" justify="center" align="center" marginTop={300}>
        <Spinner speed="0.7s" size="sm" color="gray.400" />
      </HStack>
    )
  }

  return <EditorPage />
}
