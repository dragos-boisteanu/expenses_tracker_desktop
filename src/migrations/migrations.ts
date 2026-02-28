import createExpensesTable from './23_03_58_28_02_2026_create_expenses_table.js'
import createNotificationsTable from './23_04_04_28_02_2026_create_notifications_table.js'
import createExpensesIdValueUniqueIndex from './23_17_32_28_02_2026_create_expenses_id_date_unique_index.js'


export default [
  { name: 'create_expenses_table', up: createExpensesTable },
  { name: 'create_notifications_table', up: createNotificationsTable },

  // 👉 Indexes come AFTER tables
  {name: 'create_expenses_id_date_unique_index', up: createExpensesIdValueUniqueIndex},
]
