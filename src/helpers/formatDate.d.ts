import { Dayjs } from 'dayjs';
declare const formatDate: (expenseDate: Dayjs, previousExpenseDate: Dayjs, yesterday: Dayjs) => {
    showDayLimiter: boolean;
    dayLimiterText: string;
};
export default formatDate;
