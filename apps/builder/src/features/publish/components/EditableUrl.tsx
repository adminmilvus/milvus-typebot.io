import {
  HStack,
  Tooltip,
  EditablePreview,
  EditableInput,
  Text,
  Editable,
  Button,
  ButtonProps,
  useEditableControls,
} from '@chakra-ui/react'
import { EditIcon } from '@/components/icons'
import { CopyButton } from '@/components/CopyButton'
import React, { useState } from 'react'

type EditableUrlProps = {
  hostname: string
  pathname?: string
  isValid: (newPathname: string) => Promise<boolean> | boolean
  onPathnameChange: (pathname: string) => void
  isDisabled?: boolean
}

export const EditableUrl = ({
  isDisabled = false,
  hostname,
  pathname,
  isValid,
  onPathnameChange,
}: EditableUrlProps) => {
  const [value, setValue] = useState(pathname)

  const handleSubmit = async (newPathname: string) => {
    if (newPathname === pathname) return
    if (await isValid(newPathname)) return onPathnameChange(newPathname)
    setValue(pathname)
  }

  return (
    <Editable
      as={HStack}
      spacing={3}
      value={value + '/chat_id'}
      onChange={setValue}
      onSubmit={handleSubmit}
      isDisabled={isDisabled}
    >
      <HStack spacing={1}>
        <Text>{hostname}/</Text>
        <Tooltip label="Edit">
          <EditablePreview
            mx={1}
            borderWidth="1px"
            px={3}
            rounded="md"
            cursor="text"
            display="flex"
            fontWeight="semibold"
          />
        </Tooltip>
        <EditableInput px={2} />
      </HStack>

      <HStack>
        {!isDisabled && <EditButton size="xs" />}
        <CopyButton
          size="xs"
          textToCopy={`${hostname}/${value + '/chat_id' ?? ''}`}
        />
      </HStack>
    </Editable>
  )
}

const EditButton = (props: ButtonProps) => {
  const { isEditing, getEditButtonProps } = useEditableControls()

  return isEditing ? null : (
    <Button leftIcon={<EditIcon />} {...props} {...getEditButtonProps()}>
      Editar
    </Button>
  )
}
