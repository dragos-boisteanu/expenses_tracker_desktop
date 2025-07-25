import { PiniaStore } from '@/types/PiniaStore'
import { useToastStore } from '@/stores/toast'

export class NotifierService {
  store: PiniaStore<typeof useToastStore>
  readonly DEFAULT_DURATION = 3
  constructor() {
    this.store = useToastStore()
  }

  add(title: string, description: string = '', duration: number = this.DEFAULT_DURATION) {
    const id = this.store.list.length + 1
  }
}
