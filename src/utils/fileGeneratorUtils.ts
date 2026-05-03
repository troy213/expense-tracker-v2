import * as XLSX from 'xlsx'
import { getDate } from '.'
import dbServices from '@/lib/db'

export const readXlsx = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // Support both old format (category) and new format (category_id)
        const dataHeader = [
          'date',
          'id',
          'category_id',
          'description',
          'amount',
        ]
        const categoryHeader = ['id', 'type', 'name', 'budget']

        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const dataSheetName = workbook.SheetNames[0]
        const categorySheetName = workbook.SheetNames[1]
        const dataSheet = workbook.Sheets[dataSheetName]
        const categorySheet = workbook.Sheets[categorySheetName]
        const dataRawData = XLSX.utils.sheet_to_json(dataSheet, {
          header: dataHeader,
        })
        const categoryRawData = XLSX.utils.sheet_to_json(categorySheet, {
          header: categoryHeader,
        })
        const dataOutput = dataRawData.slice(1, dataRawData.length)
        const categoryOutput = categoryRawData.slice(1, categoryRawData.length)

        resolve({ dataOutput, categoryOutput })
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

export const createExcelFile = async () => {
  const transactions = await dbServices.getAllTransactions()
  const categories = await dbServices.getAllCategories()

  const workbook = XLSX.utils.book_new()

  // Create Data worksheet header
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Date', 'ID', 'Category ID', 'Description', 'Amount'],
  ])

  // Output: 2025-01-01, {id}, {subId}, expense, transport, bus, 2000
  transactions.forEach((transaction) => {
    const { date, id, category_id, description, amount } = transaction
    XLSX.utils.sheet_add_json(
      worksheet,
      [
        {
          date,
          id,
          category_id,
          description,
          amount,
        },
      ],
      { skipHeader: true, origin: -1 }
    )
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
  XLSX.writeFile(workbook, `Expense Tracker (${getDate()}).xlsx`)
}
