export default class ExpensesDB {
    db;
    static _instance;
    constructor() {
        this.db = window['db'];
    }
    static get instance() {
        if (!ExpensesDB._instance) {
            ExpensesDB._instance = new ExpensesDB();
        }
        return ExpensesDB._instance;
    }
    async getList(offset, limit) {
        return await this.db.getList(offset, limit);
    }
    async export(fileName) {
        return await this.db.exportExpenses(fileName);
    }
    async import(expenses) {
        return await this.db.importExpenses(expenses);
    }
    async add(expense) {
        return await this.db.insert(expense);
    }
    async delete(id) {
        return await this.db.delete(id);
    }
    async deleteAllData() {
        return await this.db.deleteAllData();
    }
}
