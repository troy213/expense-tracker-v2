import * as XLSX from 'xlsx'
import { Category, CategoryType, Data } from '@/types'
import { getStorage } from '.'

export type DataOutput = {
  date: string
  id: string
  subdataId: string
  type: CategoryType
  category: string
  description: string
  amount: number
}

export const readXlsx = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const dataHeader = [
          'date',
          'id',
          'subdataId',
          'type',
          'category',
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

export const processData = (dataOutput: DataOutput[]) => {
  const newData: Data[] = []
  dataOutput.forEach((item) => {
    const { amount, category, date, description, id, subdataId, type } = item
    const dataIndex = newData.findIndex(
      (dataItem) => dataItem.date === date && dataItem.id === id
    )

    if (dataIndex >= 0) {
      const subdataIndex = newData[dataIndex].subdata.findIndex(
        (subdataItem) => subdataItem.id === subdataId
      )

      if (subdataIndex >= 0) {
        newData[dataIndex].subdata[subdataIndex].item.push({
          description,
          amount,
        })
      } else {
        newData[dataIndex].subdata.push({
          id: subdataId,
          category,
          type,
          item: [
            {
              description,
              amount,
            },
          ],
        })
      }
    } else {
      newData.push({
        date,
        id,
        subdata: [
          {
            category,
            id: subdataId,
            type,
            item: [
              {
                description,
                amount,
              },
            ],
          },
        ],
      })
    }
  })

  return newData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
