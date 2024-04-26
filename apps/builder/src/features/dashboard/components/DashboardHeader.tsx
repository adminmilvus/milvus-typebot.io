import React from 'react'
import { HStack, Flex, useDisclosure } from '@chakra-ui/react'
import { HardDriveIcon } from '@/components/icons'
import { useUser } from '@/features/account/hooks/useUser'
import {} from '@typebot.io/lib'
import Link from 'next/link'
import { EmojiOrImageIcon } from '@/components/EmojiOrImageIcon'
import { useWorkspace } from '@/features/workspace/WorkspaceProvider'
import { WorkspaceDropdown } from '@/features/workspace/components/WorkspaceDropdown'
import { WorkspaceSettingsModal } from '@/features/workspace/components/WorkspaceSettingsModal'

export const DashboardHeader = () => {
  const { user } = useUser()
  const { workspace, switchWorkspace, createWorkspace } = useWorkspace()

  const { isOpen, onClose } = useDisclosure()

  const handleCreateNewWorkspace = () =>
    createWorkspace(user?.name ?? undefined)

  return (
    <Flex w="full" borderBottomWidth="1px" justify="center">
      <Flex
        justify="space-between"
        alignItems="center"
        h="16"
        maxW="1000px"
        flex="1"
      >
        <Link href="/typebots" data-testid="typebot-logo">
          <EmojiOrImageIcon
            boxSize="30px"
            icon={workspace?.icon}
            defaultIcon={HardDriveIcon}
          />
        </Link>
        <HStack>
          {user && workspace && !workspace.isPastDue && (
            <WorkspaceSettingsModal
              isOpen={isOpen}
              onClose={onClose}
              user={user}
              workspace={workspace}
            />
          )}
          {/* {!workspace?.isPastDue && (
            <Button
              leftIcon={<SettingsIcon />}
              onClick={onOpen}
              isLoading={isNotDefined(workspace)}
            >
              {t('dashboard.header.settingsButton.label')}
            </Button>
          )} */}
          <WorkspaceDropdown
            currentWorkspace={workspace}
            onLogoutClick={() => {}}
            onCreateNewWorkspaceClick={handleCreateNewWorkspace}
            onWorkspaceSelected={switchWorkspace}
          />
        </HStack>
      </Flex>
    </Flex>
  )
}
