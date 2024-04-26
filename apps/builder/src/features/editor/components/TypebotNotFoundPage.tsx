import { Flex, Heading, VStack, Text } from '@chakra-ui/react'
import { useTranslate } from '@tolgee/react'

export const TypebotNotFoundPage = () => {
  const { t } = useTranslate()
  return (
    <Flex justify="center" align="center" w="full" h="100vh">
      <VStack spacing={6}>
        <VStack>
          <Heading>401</Heading>
          <Text fontSize="xl"> {t('milvus.route.401')}</Text>
        </VStack>
      </VStack>
    </Flex>
  )
}
