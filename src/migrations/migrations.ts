import createExpensesTable from './23_03_58_28_02_2026_create_expenses_table.js'
import createNotificationsTable from './23_04_04_28_02_2026_create_notifications_table.js'
import createExpensesIdValueUniqueIndex from './23_17_32_28_02_2026_create_expenses_id_date_unique_index.js'
import createChangelogTable from './21_57_37_21_03_2026_create_chagelogs_table.js'
import addDescriptionToExpenses from './01_42_56_04_07_2026_add_description_to_expenses.js'
import addUpdatedAtToExpenses from './20_30_03_28_07_2026_add_updated_at_to_expenses.js'
import addCreatedAtToExpenses from './20_31_23_28_07_2026_add_created_at_to_expenses.js'
import convertExpenseDateToInteger from './23_38_29_28_07_2026_convert_expense_date_to_integer.js'
import addDefaultCreatedAtToExpenses from './22_35_23_17_08_2026_add_default_created_at_to_expenses.js'
import createExpensesTriggerSetUpdatedAt from './22_41_26_17_08_2026_create_expenses_trigger_set_updated_at.js'
import dropExpensesUpdatedAtTrigger from './23_25_34_17_08_2026_drop_expenses_updated_at_trigger.js'
import makeCreatedAtDefaultUnixEpoch from './23_43_02_24_08_2026_make_created_at_default_unixepoch.js'

export default [
  { name: 'create_expenses_table', up: createExpensesTable },
  { name: 'create_notifications_table', up: createNotificationsTable },
  { name: 'create_changelogs_table', up: createChangelogTable },
  { name: 'add_description_to_expenes', up: addDescriptionToExpenses },
  { name: 'add_updated_at_to_expenses', up: addUpdatedAtToExpenses },
  { name: 'add_created_at_to_expenses', up: addCreatedAtToExpenses },
  { name: 'convert_expense_date_to_integer', up: convertExpenseDateToInteger },
  { name: 'add_default_created_at_to_expense', up: addDefaultCreatedAtToExpenses },
  { name: 'create_expenses_trigger_set_updated_at', up: createExpensesTriggerSetUpdatedAt },
  { name: 'drop_expenses_updated_at_trigger', up: dropExpensesUpdatedAtTrigger },
  { name: 'make_created_at_default_unixepoch', up: makeCreatedAtDefaultUnixEpoch },

  // 👉 Indexes come AFTER tables
  { name: 'create_expenses_id_date_unique_index', up: createExpensesIdValueUniqueIndex },
]
