import * as XLSX from 'xlsx'
import { Category, Data } from '@/types'
import { getStorage } from '.'

export const createExcelFile = () => {
  const storedData = getStorage('data')
  const storedCategories = getStorage('categories')
  const data = storedData ? (JSON.parse(storedData) as Data[]) : []
  const categories = storedCategories
    ? (JSON.parse(storedCategories) as Category[])
    : []

  const workbook = XLSX.utils.book_new()

  // Create Data worksheet header
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Date', 'ID', 'Subdata ID', 'Type', 'Category', 'Description', 'Amount'],
  ])

  // Output: 2025-01-01, {id}, {subId}, expense, transport, bus, 2000
  data.forEach((item) => {
    const { id, date, subdata } = item

    subdata.forEach((subitem) => {
      const { id: subId, category, type } = subitem

      subitem.item.forEach((subsubitem) => {
        const { amount, description } = subsubitem

        XLSX.utils.sheet_add_json(
          worksheet,
          [{ date, id, subId, type, category, description, amount }],
          { skipHeader: true, origin: -1 }
        )
      })
    })
  })

  // Create Categories worksheet header
  const categoriesWorksheet = XLSX.utils.aoa_to_sheet([
    ['ID', 'Type', 'Name', 'Budget'],
  ])

  categories.forEach((item) => {
    const { id, type, name, budget } = item
    XLSX.utils.sheet_add_json(
      categoriesWorksheet,
      [{ id, type, name, budget }],
      { skipHeader: true, origin: -1 }
    )
  })

  // Append worksheet named data to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
  XLSX.utils.book_append_sheet(workbook, categoriesWorksheet, 'Categories')

  // Export file
  XLSX.writeFile(workbook, 'Expense Tracker.xlsx')
}
