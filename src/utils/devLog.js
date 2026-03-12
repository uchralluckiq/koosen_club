/**
 * [DEV] Log mock table data to console when it changes.
 * To disable: set DEV_DB_LOG to false.
 * To remove: delete this file and all logTable() calls (search for "logTable" or "DEV_DB_LOG").
 */
export const DEV_DB_LOG = true

export function logTable(tableName, data) {
  if (!DEV_DB_LOG) return
  try {
    console.log(`[DEV] ${tableName}`, JSON.parse(JSON.stringify(data)))
  } catch {
    console.log(`[DEV] ${tableName}`, data)
  }
}
