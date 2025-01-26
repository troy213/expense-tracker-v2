import { useIntl } from 'react-intl'
import { DATE_RANGE } from '@/constants'

type MoreOptionModalProps = {
  className: string
  handleChangeDateRange: (arg: number) => void
}

const DateRangeModal: React.FC<MoreOptionModalProps> = ({
  handleChangeDateRange,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="date-range-modal">
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={() => handleChangeDateRange(DATE_RANGE.ALL_TIME)}
      >
        <span>{formatMessage({ id: 'All' })}</span>
      </button>
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={() => handleChangeDateRange(DATE_RANGE.THIS_MONTH)}
      >
        <span>{formatMessage({ id: 'ThisMonth' })}</span>
      </button>
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={() => handleChangeDateRange(DATE_RANGE.LAST_MONTH)}
      >
        <span>{formatMessage({ id: 'LastMonth' })}</span>
      </button>
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={() => handleChangeDateRange(DATE_RANGE.THIS_YEAR)}
      >
        <span>{formatMessage({ id: 'ThisYear' })}</span>
      </button>
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={() => handleChangeDateRange(DATE_RANGE.CUSTOM_FILTER)}
      >
        <span>{formatMessage({ id: 'CustomFilter' })}</span>
      </button>
    </div>
  )
}

export default DateRangeModal
