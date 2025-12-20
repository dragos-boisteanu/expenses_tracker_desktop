import type { Expense } from '@/types/expense';
import type { IExpensesSource } from '@/interfaces/IExpensesSource';
import type { ImportedExpense } from '@/types/importedExpense';
export default class ExpensesDB implements IExpensesSource {
    private db;
    private static _instance;
    constructor();
    static get instance(): ExpensesDB;
    getList(offset: number, limit: number): Promise<Expense[]>;
    export(fileName: string): Promise<any>;
    import(expenses: ImportedExpense[]): Promise<any>;
    add(expense: Expense): Promise<any>;
    delete(id: number): Promise<any>;
    deleteAllData(): Promise<any>;
}
