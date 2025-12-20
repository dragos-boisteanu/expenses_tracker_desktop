import { inject } from 'vue';
import { DayjsKey } from '@/plugins/dayjsKey';
export function useDayjs() {
    const dayjs = inject(DayjsKey);
    if (!dayjs) {
        throw new Error('dayjs not provided');
    }
    return dayjs;
}
