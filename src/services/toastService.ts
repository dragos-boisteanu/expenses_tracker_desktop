mport { PiniaStore } from '@/types/PiniaStore'
import { useToastStore } from '@/stores/toast'
import { ToastType } from '@/types/ToastType'

export class ToastService {
  store: PiniaStore<typeof useToastStore>
  constructor() {
    this.store = useToastStore()
  }

  list(): ToastType[] {
    return this.store.list
  }

  add(text: string, type: string = '', path: string = '') {
    const id = this.store.list.length + 1
    this.store.add({
      id,
      text,
      path,
    })
  }

  remove(id: number) {
    this.store.remove(id)
  }
}
