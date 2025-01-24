import { useIntl } from 'react-intl'
import { createExcelFile } from '@/utils/fileGeneratorUtils'
import Modal from '.'

type ExportDataModalProps = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const { formatMessage } = useIntl()

  const handleExport = () => {
    createExcelFile()
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="flex-column gap-4">
        <span className="text--bold text--color-primary">
          {formatMessage({ id: 'ExportData' })}
        </span>
        <span className="text--color-primary text--3">
          {formatMessage({ id: 'ExportDataMessage' })}
        </span>
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
            onClick={handleExport}
          >
            {formatMessage({ id: 'Export' })}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ExportDataModal
