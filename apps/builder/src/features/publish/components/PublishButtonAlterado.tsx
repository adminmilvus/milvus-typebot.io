import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { useRouter } from 'next/router'
import { useToast } from '@/hooks/useToast'
import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc'
import { useTranslate } from '@tolgee/react'
import {
  ChevronLeftIcon,
  ChatIcon,
  SaveIcon,
  ExternalLinkIcon,
  LayoutIcon,
} from '@/components/icons'
import {
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'

export const PublishButtonAlterado = () => {
  const { push, query, pathname } = useRouter()
  const { save, typebot } = useTypebot()
  const { t } = useTranslate()

  const [showDashboard, setshowDashboard] = useState(true)

  const { showToast } = useToast()

  const { mutate: publishTypebotMutate } =
    trpc.typebot.publishTypebot.useMutation({
      onError: (error) => {
        showToast({
          title: t('publish.error.label'),
          description: error.message,
        })
      },
      onSuccess: () => {
        showToast({
          title: 'Publicado',
          description: 'Publicado com sucesso',
          status: 'success',
        })
      },
    })

  const saveTypebot = async () => {
    await save()

    publishTypebotMutate({
      typebotId: typebot?.id as string,
    })

    showToast({
      title: 'Salvo',
      description: 'Salvo com sucesso',
      status: 'success',
    })
  }

  const openIntegration = () => {
    push(`/typebots/${query.typebotId}/share`)
  }
  const openDashBoard = () => {
    push(`/typebots/${query.typebotId}/edit`)
  }
  const openChat = () => {
    push(`${process.env.NEXT_PUBLIC_VIEWER_URL}/${query.typebotId}/chat_id`)
  }

  useEffect(() => {
    if (pathname.includes('edit')) {
      setshowDashboard(true)
    } else {
      setshowDashboard(false)
    }
  }, [pathname])

  return (
    <HStack spacing="1px">
      <Menu>
        <MenuButton
          as={IconButton}
          colorScheme={'blue'}
          borderLeftRadius={0}
          icon={<ChevronLeftIcon transform="rotate(-90deg)" />}
          aria-label={t('publishButton.dropdown.showMenu.label')}
          size="sm"
          isDisabled={false}
        />

        <MenuList>
          <MenuItem onClick={saveTypebot} icon={<SaveIcon />}>
            {t('milvus.label.menu.SaveAndPublic')}
          </MenuItem>

          {!showDashboard && (
            <MenuItem onClick={openDashBoard} icon={<LayoutIcon />}>
              {t('milvus.label.menu.Dashboard')}
            </MenuItem>
          )}
          {showDashboard && (
            <MenuItem onClick={openIntegration} icon={<ExternalLinkIcon />}>
              {t('milvus.label.menu.Integration')}
            </MenuItem>
          )}
          <MenuItem onClick={openChat} icon={<ChatIcon />}>
            {t('milvus.label.menu.Chat')}
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  )
}
