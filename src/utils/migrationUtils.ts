import { Data, Transaction } from '@/types'

/**
 * Migrate old Data structure (with subdata) to new Transaction structure
 * Each item in subdata becomes a separate transaction
 */
export const migrateOldDataToTransactions = (
  oldData: Data[]
): Transaction[] => {
  const transactions: Transaction[] = []

  oldData.forEach((dataEntry) => {
    dataEntry.subdata.forEach((subdataItem) => {
      subdataItem.item.forEach((item) => {
        transactions.push({
          id: crypto.randomUUID(),
          date: dataEntry.date,
          category_id: subdataItem.category_id,
          description: item.description,
          amount: item.amount,
        })
      })
    })
  })

  return transactions
}
