import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { useAppDispatch } from '@/hooks'
import dbServices from '@/lib/db'
import { Category, Transaction } from '@/types'
import { categoriesAction } from '@/store/categories/categories-slice'
import { mainAction } from '@/store/main/main-slice'
import { processMainData } from '@/utils'
import { readXlsx } from '@/utils/fileGeneratorUtils'
import Modal from '.'
import Form from '../Form'

type ImportDataModalProps = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

const ImportDataModal: React.FC<ImportDataModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { formatMessage } = useIntl()

  const handleImport = async (formData: { file: File | null }) => {
    const { file } = formData
    if (file) {
      try {
        const rawData = (await readXlsx(file)) as {
          dataOutput: Transaction[]
          categoryOutput: Category[]
        }

        await dbServices.importData({
          categories: rawData.categoryOutput,
          transactions: rawData.dataOutput,
        })

        const newData = processMainData(rawData.dataOutput)

        dispatch(mainAction.setState({ state: 'data', value: newData }))
        dispatch(categoriesAction.addCategories(rawData.categoryOutput))

        navigate('/')
      } catch (err) {
        console.error(err)
      }

      setIsOpen(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Form
        className="flex-column gap-4"
        onSubmit={handleImport}
        onCancel={() => setIsOpen(false)}
      >
        <span className="text--bold text--color-primary">
          {formatMessage({ id: 'ImportData' })}
        </span>

        <Form.File
          label={formatMessage({ id: 'Import' })}
          valueKey="file"
          placeholder="file"
          accept=".xlsx"
          required
        />

        <Form.Submit />
        <Form.Cancel />
      </Form>
    </Modal>
  )
}

export default ImportDataModal
