import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { EditFormValues } from '../config'

type EditDraft = Partial<EditFormValues>

interface EditDraftStore {
  clearDraft: (itemId: string) => void
  drafts: Record<string, EditDraft>
  getDraft: (itemId: string) => EditDraft | undefined
  saveDraft: (itemId: string, values: EditFormValues) => void
}

const DRAFT_STORAGE_KEY = 'edit-page-drafts'

export const useEditDraftStore = create<EditDraftStore>()(
  persist(
    (set, get) => ({
      clearDraft: (itemId) =>
        set((state) => {
          const { [itemId]: _removed, ...restDrafts } = state.drafts
          return { drafts: restDrafts }
        }),
      drafts: {},
      getDraft: (itemId) => get().drafts[itemId],
      saveDraft: (itemId, values) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [itemId]: values,
          },
        })),
    }),
    {
      name: DRAFT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
