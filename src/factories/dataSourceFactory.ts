import LocalDB from '@/repositories/LocalDB'
import { IDb } from '@/interfaces/IDb'

export default (type: string) => {
  let instance: IDb
  switch (type) {
    case 'local':
      instance = new LocalDB()
      break
  }

  return instance
}
