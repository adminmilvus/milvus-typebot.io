import { DropdownList } from '@/components/DropdownList'
import { CodeEditor } from '@/components/inputs/CodeEditor'
import { SwitchWithLabel } from '@/components/inputs/SwitchWithLabel'
import { TableList, TableListItemProps } from '@/components/TableList'
import { useTypebot } from '@/features/editor/providers/TypebotProvider'
import { useToast } from '@/hooks/useToast'
import {
  Stack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Text,
} from '@chakra-ui/react'
import {
  KeyValue,
  VariableForTest,
  ResponseVariableMapping,
  HttpRequest,
  HttpRequestBlock,
} from '@typebot.io/schemas'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { executeWebhook } from '../queries/executeWebhookQuery'
import { convertVariablesForTestToVariables } from '../helpers/convertVariablesForTestToVariables'
import { getDeepKeys } from '../helpers/getDeepKeys'
import { QueryParamsInputs, HeadersInputs } from './KeyValueInputs'
import { DataVariableInputs } from './ResponseMappingInputs'
import { VariableForTestInputs } from './VariableForTestInputs'
import { SwitchWithRelatedSettings } from '@/components/SwitchWithRelatedSettings'
import {
  HttpMethod,
  defaultTimeout,
  defaultWebhookAttributes,
  defaultWebhookBlockOptions,
  maxTimeout,
} from '@typebot.io/schemas/features/blocks/integrations/webhook/constants'
import { NumberInput } from '@/components/inputs'
import { MilvusBlockType } from '@typebot.io/schemas/features/blocks/milvus/constants'
import { useTranslate } from '@tolgee/react'
import { TextInput } from '@/components/inputs'
import ColorsTokens from 'config-milvus/colors'
import {
  IBaseConhecimento,
  IChamado,
  ICliente,
  IClienteContato,
} from 'config-milvus/abstracts'

type Props = {
  blockId: string
  webhook: HttpRequest | undefined
  options: HttpRequestBlock['options']
  onWebhookChange: (webhook: HttpRequest) => void
  onOptionsChange: (options: HttpRequestBlock['options']) => void
  milvusType?: MilvusBlockType
}

export const HttpRequestAdvancedConfigForm = ({
  milvusType,
  blockId,
  webhook,
  options,
  onWebhookChange,
  onOptionsChange,
}: Props) => {
  const { t } = useTranslate()
  const { typebot, save } = useTypebot()
  const [isTestResponseLoading, setIsTestResponseLoading] = useState(false)
  const [testResponse, setTestResponse] = useState<string>()
  const [responseKeys, setResponseKeys] = useState<string[]>([])
  const [showParams, setShowParams] = useState(true)
  const { showToast } = useToast()

  const updateMethod = (method: HttpMethod) =>
    onWebhookChange({ ...webhook, method })

  const updateQueryParams = (queryParams: KeyValue[]) =>
    onWebhookChange({ ...webhook, queryParams })

  const updateHeaders = (headers: KeyValue[]) =>
    onWebhookChange({ ...webhook, headers })

  const updateBody = (body: string) => onWebhookChange({ ...webhook, body })

  const updateBodyEspec = useCallback(
    (bodyEspec: IChamado | IBaseConhecimento | ICliente | IClienteContato) => {
      let body = webhook?.body ? JSON.parse(webhook?.body) : {}

      body = { ...body, ...bodyEspec }

      onWebhookChange({
        ...webhook,
        body: JSON.stringify(body),
      })
    },
    [onWebhookChange, webhook]
  )

  const updateVariablesForTest = (variablesForTest: VariableForTest[]) =>
    onOptionsChange({ ...options, variablesForTest })

  const updateResponseVariableMapping = (
    responseVariableMapping: ResponseVariableMapping[]
  ) => onOptionsChange({ ...options, responseVariableMapping })

  const updateAdvancedConfig = (isAdvancedConfig: boolean) =>
    onOptionsChange({ ...options, isAdvancedConfig })

  const updateIsCustomBody = (isCustomBody: boolean) =>
    onOptionsChange({ ...options, isCustomBody })

  const updateTimeout = (timeout: number | undefined) =>
    onOptionsChange({ ...options, timeout })

  const executeTestRequest = async () => {
    if (!typebot) return
    setIsTestResponseLoading(true)
    if (!options?.webhook) await save()
    else await save()
    const { data, error } = await executeWebhook(
      typebot.id,
      convertVariablesForTestToVariables(
        options?.variablesForTest ?? [],
        typebot.variables
      ),
      { blockId }
    )
    if (error)
      return showToast({ title: error.name, description: error.message })
    setTestResponse(JSON.stringify(data, undefined, 2))
    setResponseKeys(getDeepKeys(data))
    setIsTestResponseLoading(false)
  }

  const updateIsExecutedOnClient = (isExecutedOnClient: boolean) =>
    onOptionsChange({ ...options, isExecutedOnClient })

  const ResponseMappingInputs = useMemo(
    () =>
      function Component(props: TableListItemProps<ResponseVariableMapping>) {
        return <DataVariableInputs {...props} dataItems={responseKeys} />
      },
    [responseKeys]
  )

  useEffect(() => {
    const typesNoParams = [
      MilvusBlockType.SPEAK_WITH_ATTENDANT,
      MilvusBlockType.CLOSE_CHAT,
    ]
    if (!milvusType) {
      setShowParams(false)
      return
    }

    if (typesNoParams.includes(milvusType)) {
      setShowParams(false)
    } else {
      setShowParams(true)
    }
  }, [milvusType, updateBodyEspec, typebot])

  if (!milvusType) {
    return (
      <>
        <SwitchWithRelatedSettings
          label="Advanced configuration"
          initialValue={
            options?.isAdvancedConfig ??
            defaultWebhookBlockOptions.isAdvancedConfig
          }
          onCheckChange={updateAdvancedConfig}
        >
          <SwitchWithLabel
            label="Execute on client"
            moreInfoContent="If enabled, the webhook will be executed on the client. It means it will be executed in the browser of your visitor. Make sure to enable CORS and do not expose sensitive data."
            initialValue={
              options?.isExecutedOnClient ??
              defaultWebhookBlockOptions.isExecutedOnClient
            }
            onCheckChange={updateIsExecutedOnClient}
          />
          <HStack justify="space-between">
            <Text>Method:</Text>
            <DropdownList
              currentItem={
                (webhook?.method ??
                  defaultWebhookAttributes.method) as HttpMethod
              }
              onItemSelect={updateMethod}
              items={Object.values(HttpMethod)}
            />
          </HStack>
          <Accordion allowMultiple>
            <AccordionItem>
              <AccordionButton justifyContent="space-between">
                Query params
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pt="4">
                <TableList<KeyValue>
                  initialItems={webhook?.queryParams}
                  onItemsChange={updateQueryParams}
                  addLabel="Add a param"
                >
                  {(props) => <QueryParamsInputs {...props} />}
                </TableList>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton justifyContent="space-between">
                Headers
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pt="4">
                <TableList<KeyValue>
                  initialItems={webhook?.headers}
                  onItemsChange={updateHeaders}
                  addLabel="Add a value"
                >
                  {(props) => <HeadersInputs {...props} />}
                </TableList>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton justifyContent="space-between">
                Body
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={4} as={Stack} spacing="6">
                <SwitchWithLabel
                  label="Custom body"
                  initialValue={true}
                  onCheckChange={updateIsCustomBody}
                  isDisabled={true}
                />

                <CodeEditor
                  defaultValue={webhook?.body}
                  lang="json"
                  onChange={updateBody}
                  debounceTimeout={0}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton justifyContent="space-between">
                Advanced parameters
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pt="4">
                <NumberInput
                  label="Timeout (s)"
                  defaultValue={options?.timeout ?? defaultTimeout}
                  min={1}
                  max={maxTimeout}
                  onValueChange={updateTimeout}
                  withVariableButton={false}
                />
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton justifyContent="space-between">
                Variable values for test
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pt="4">
                <TableList<VariableForTest>
                  initialItems={options?.variablesForTest}
                  onItemsChange={updateVariablesForTest}
                  addLabel="Add an entry"
                >
                  {(props) => <VariableForTestInputs {...props} />}
                </TableList>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </SwitchWithRelatedSettings>
        {webhook?.url && (
          <Button
            onClick={executeTestRequest}
            colorScheme="blue"
            isLoading={isTestResponseLoading}
          >
            Test the request
          </Button>
        )}
        {testResponse && (
          <CodeEditor isReadOnly lang="json" value={testResponse} />
        )}
        {(testResponse ||
          (options?.responseVariableMapping &&
            options.responseVariableMapping.length > 0)) && (
          <Accordion allowMultiple>
            <AccordionItem>
              <AccordionButton justifyContent="space-between">
                Save in variables
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pt="4">
                <TableList<ResponseVariableMapping>
                  initialItems={options?.responseVariableMapping}
                  onItemsChange={updateResponseVariableMapping}
                  addLabel="Add an entry"
                >
                  {(props) => <ResponseMappingInputs {...props} />}
                </TableList>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
      </>
    )
  }

  if (milvusType && options?.webhook) {
    return (
      <>
        <Accordion allowMultiple>
          {showParams && (
            <AccordionItem>
              <AccordionButton justifyContent="space-between">
                Parâmetros
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={4} as={Stack} spacing="6">
                {milvusType === MilvusBlockType.CREATE_TICKET && (
                  <>
                    <TextInput
                      colorLabel={ColorsTokens.green4}
                      label="Id do cliente:"
                      onChange={(v) => updateBodyEspec({ cliente_id: v })}
                      defaultValue={
                        webhook?.body
                          ? JSON.parse(webhook?.body).cliente_id
                          : ''
                      }
                    />
                    <TextInput
                      colorLabel={ColorsTokens.green4}
                      label="Assunto:"
                      onChange={(v) => updateBodyEspec({ chamado_assunto: v })}
                      defaultValue={
                        webhook?.body
                          ? JSON.parse(webhook?.body).chamado_assunto
                          : ''
                      }
                    />
                    <TextInput
                      colorLabel={ColorsTokens.green4}
                      label="Descrição:"
                      onChange={(v) =>
                        updateBodyEspec({ chamado_descricao: v })
                      }
                      defaultValue={
                        webhook?.body
                          ? JSON.parse(webhook?.body).chamado_descricao
                          : ''
                      }
                    />
                  </>
                )}

                {milvusType === MilvusBlockType.BASE_BY_TAG && (
                  <TextInput
                    colorLabel={ColorsTokens.green4}
                    label="Consulta:"
                    onChange={(v) => updateBodyEspec({ tag: v })}
                    defaultValue={
                      webhook?.body ? JSON.parse(webhook?.body).tag : ''
                    }
                  />
                )}

                {milvusType === MilvusBlockType.ARTICLE_BY_ID && (
                  <TextInput
                    colorLabel={ColorsTokens.green4}
                    label="Consulta:"
                    onChange={(v) => updateBodyEspec({ artigo_id: v })}
                    defaultValue={
                      webhook?.body ? JSON.parse(webhook?.body).artigo_id : ''
                    }
                  />
                )}

                {milvusType === MilvusBlockType.CLIENT_BY_DOCUMENTO && (
                  <TextInput
                    colorLabel={ColorsTokens.green4}
                    label="Documento cliente:"
                    onChange={(v) => updateBodyEspec({ documento: v })}
                    defaultValue={
                      webhook?.body ? JSON.parse(webhook?.body).documento : ''
                    }
                  />
                )}

                {milvusType === MilvusBlockType.CLIENT_BY_EMAIL && (
                  <TextInput
                    colorLabel={ColorsTokens.green4}
                    label="Email cliente:"
                    onChange={(v) => updateBodyEspec({ email: v })}
                    defaultValue={
                      webhook?.body ? JSON.parse(webhook?.body).email : ''
                    }
                  />
                )}
              </AccordionPanel>
            </AccordionItem>
          )}

          <AccordionItem>
            <AccordionButton justifyContent="space-between">
              {t('milvus.config.variableValuesToTest')}
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pt="4">
              <TableList<VariableForTest>
                initialItems={options?.variablesForTest}
                onItemsChange={updateVariablesForTest}
                addLabel="Add an entry"
              >
                {(props) => <VariableForTestInputs {...props} />}
              </TableList>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Button
          onClick={executeTestRequest}
          colorScheme="blue"
          isLoading={isTestResponseLoading}
        >
          {t('milvus.config.testRequest')}
        </Button>
        {testResponse && (
          <CodeEditor isReadOnly lang="json" value={testResponse} />
        )}
        {(testResponse ||
          (options?.responseVariableMapping &&
            options.responseVariableMapping.length > 0)) && (
          <Accordion allowMultiple>
            <AccordionItem>
              <AccordionButton justifyContent="space-between">
                {t('milvus.config.saveVariable')}
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pt="4">
                <TableList<ResponseVariableMapping>
                  initialItems={options?.responseVariableMapping}
                  onItemsChange={updateResponseVariableMapping}
                  addLabel="Add an entry"
                >
                  {(props) => <ResponseMappingInputs {...props} />}
                </TableList>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
      </>
    )
  }
}
