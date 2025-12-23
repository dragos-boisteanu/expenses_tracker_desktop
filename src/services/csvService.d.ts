import type { Expense } from '@/types/expense';
import type { ImportedExpense } from '@/types/importedExpense';
export declare class CsvService {
    export(data: Expense[], header?: boolean): Promise<Blob>;
    import(file: File): Promise<ImportedExpense[]>;
}
