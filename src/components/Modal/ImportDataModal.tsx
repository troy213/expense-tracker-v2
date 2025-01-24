import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useAppDispatch } from '@/hooks'
import { mainAction } from '@/store/main/main-slice'
import { categoriesAction } from '@/store/categories/categories-slice'
import { Category } from '@/types'
import { setStorage } from '@/utils'
import { DataOutput, processData, readXlsx } from '@/utils/fileGeneratorUtils'
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
  const [file, setFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (file) {
      try {
        const rawData = (await readXlsx(file)) as {
          dataOutput: DataOutput[]
          categoryOutput: Category[]
        }
        const newData = processData(rawData.dataOutput)

        dispatch(mainAction.setData(newData))
        dispatch(categoriesAction.setCategories(rawData.categoryOutput))
        setStorage('data', newData)
        setStorage('categories', rawData.categoryOutput)
      } catch (err) {
        console.error(err)
      }

      setIsOpen(false)
    } else {
      setErrorMessage(formatMessage({ id: 'FormEmptyError' }))
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="flex-column gap-4">
        <span className="text--bold text--color-primary">
          {formatMessage({ id: 'ImportData' })}
        </span>
        <Form.File
          value={file}
          onChange={setFile}
          errorMessage={errorMessage}
          setError={setErrorMessage}
          label="Import"
          id="file"
          placeholder="file"
        />

        <div className="flex-end gap-2 pt-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setIsOpen(false)}
          >
            {formatMessage({ id: 'Cancel' })}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleImport}
          >
            {formatMessage({ id: 'Import' })}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ImportDataModal
