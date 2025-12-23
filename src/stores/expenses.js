import { defineStore } from 'pinia';
import { ref } from 'vue';
import { formatExpense } from '@/helpers/formatExpense';
import dayjs from '@/plugins/dayjs';
import currencyFormat from '@/helpers/currencyFormat';
import getLocale from '@/helpers/getLocale';
import ExpensesDB from '@/repositories/ExpensesDB';
export const useExpensesStore = defineStore('expenses', () => {
    const list = ref([]);
    const isDeletingAllData = ref(false);
    let offset = 0;
    const limit = 15;
    const allLoaded = ref(false);
    const getExpenses = async (firstPage = false, nextPage = false) => {
        try {
            if (firstPage) {
                allLoaded.value = false;
                offset = 0;
            }
            if (allLoaded.value) {
                return Promise.resolve();
            }
            const dataSource = ExpensesDB.instance;
            const expenses = await dataSource.getList(offset, limit);
            if (expenses.length < limit) {
                allLoaded.value = true;
            }
            else {
                offset += limit;
            }
            const viewExpenses = expenses.map((expense) => formatExpense(expense));
            if (nextPage) {
                list.value.push(...viewExpenses);
            }
            else {
                console.log('addImportedExpenses');
                list.value = viewExpenses;
            }
        }
        catch (error) {
            throw error;
        }
    };
    const addExpense = async (value, code) => {
        try {
            const expenseDate = dayjs();
            const unixDate = expenseDate.unix();
            const expense = {
                id: -1,
                value,
                currency: code,
                date: unixDate,
            };
            const dataSource = ExpensesDB.instance;
            const id = await dataSource.add(expense);
            const viewExpense = {
                id,
                value: currencyFormat(value, code, getLocale()),
                date: expenseDate.format('DD/MM/YY HH:mm'),
                unixDate: unixDate,
            };
            list.value.unshift(viewExpense);
        }
        catch (error) {
            throw error;
        }
    };
    const removeExpense = async (id) => {
        try {
            const dataSource = ExpensesDB.instance;
            await dataSource.delete(id);
            const expenseIndex = list.value.findIndex((expense) => expense.id === id);
            if (expenseIndex > -1) {
                list.value.splice(expenseIndex, 1);
            }
        }
        catch (error) {
            throw error;
        }
    };
    const deleteAll = async () => {
        try {
            isDeletingAllData.value = true;
            const dataSource = ExpensesDB.instance;
            await dataSource.deleteAllData();
            list.value = [];
        }
        catch (error) {
            throw error;
        }
        finally {
            isDeletingAllData.value = false;
        }
    };
    const importExpenses = (expenses) => {
        list.value.push(...expenses);
        list.value = list.value
            .filter((expense) => expense.unixDate !== null)
            .sort((a, b) => b.unixDate - a.unixDate);
    };
    return {
        list,
        allLoaded,
        getExpenses,
        addExpense,
        removeExpense,
        deleteAll,
        importExpenses,
        isDeletingAllData,
    };
});
