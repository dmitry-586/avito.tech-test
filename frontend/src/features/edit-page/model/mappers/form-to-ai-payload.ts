import type { AiEndpointIn } from '@/services'
import type { EditFormValues } from '../../config'
import { mapFormToUpdatePayload } from './form-to-update-payload'

export function mapFormToAiPayload(values: EditFormValues): AiEndpointIn {
  return mapFormToUpdatePayload(values)
}
