import { useIntl } from 'react-intl'
import Modal from '.'

type SpendGoalModalProps = {
  isOpen: boolean
  goalName: string
  amount: string | number
  onClose: () => void
  handleSpend: () => void
}

const SpendGoalModal: React.FC<SpendGoalModalProps> = ({
  isOpen,
  goalName,
  amount,
  onClose,
  handleSpend,
}) => {
  const { formatMessage } = useIntl()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex-column gap-4">
        <span className="text--bold text--color-primary">
          {formatMessage({ id: 'SpendGoal' })}
        </span>

        <span className="text--color-primary text--3">
          {formatMessage(
            { id: 'SpendGoalMessage' },
            { amount, name: goalName }
          )}
        </span>

        <div className="flex-end gap-2 pt-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={onClose}
          >
            {formatMessage({ id: 'Cancel' })}
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSpend}
          >
            {formatMessage({ id: 'SpendGoalConfirm' })}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default SpendGoalModal
