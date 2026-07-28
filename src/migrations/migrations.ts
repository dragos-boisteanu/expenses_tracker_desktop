import createExpensesTable from './23_03_58_28_02_2026_create_expenses_table.js'
import createNotificationsTable from './23_04_04_28_02_2026_create_notifications_table.js'
import createExpensesIdValueUniqueIndex from './23_17_32_28_02_2026_create_expenses_id_date_unique_index.js'
import createChangelogTable from './21_57_37_21_03_2026_create_chagelogs_table.js'
import addDescriptionToExpenses from './01_42_56_04_07_2026_add_description_to_expenses.js'
import addUpdatedAtToExpenses from './20_30_03_28_07_2026_add_updated_at_to_expenses.js'
import addCreatedAtToExpenses from './20_31_23_28_07_2026_add_created_at_to_expenses.js'
import convertExpenseDateToInteger from './23_38_29_28_07_2026_convert_expense_date_to_integer.js'

export default [
  { name: 'create_expenses_table', up: createExpensesTable },
  { name: 'create_notifications_table', up: createNotificationsTable },
  { name: 'create_changelogs_table', up: createChangelogTable },
  { name: 'add_description_to_expenes', up: addDescriptionToExpenses },
  { name: 'add_updated_at_to_expenses', up: addUpdatedAtToExpenses },
  { name: 'add_created_at_to_expenses', up: addCreatedAtToExpenses },
  { name: 'convert_expense_date_to_integer', up: convertExpenseDateToInteger },

  // 👉 Indexes come AFTER tables
  { name: 'create_expenses_id_date_unique_index', up: createExpensesIdValueUniqueIndex },
]
