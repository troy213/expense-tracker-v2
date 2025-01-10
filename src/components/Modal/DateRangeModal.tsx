import { useIntl } from 'react-intl'
// import { combineClassName } from '@/utils'

type MoreOptionModalProps = {
  className: string
  //   handleDelete: () => void
  handleChangeDateRange: (arg: number) => void
}

const DateRangeModal: React.FC<MoreOptionModalProps> = ({
  //   className = '',
  handleChangeDateRange,
}) => {
  const { formatMessage } = useIntl()
  //   const moreOptionModalClassName = combineClassName('date-range-modal', [
  //     className,
  //   ])

  return (
    <div className="date-range-modal">
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={() => handleChangeDateRange(0)}
      >
        <span>{formatMessage({ id: 'All' })}</span>
      </button>
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={() => handleChangeDateRange(1)}
      >
        <span>{formatMessage({ id: 'ThisMonth' })}</span>
      </button>
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={() => handleChangeDateRange(2)}
      >
        <span>{formatMessage({ id: 'LastMonth' })}</span>
      </button>
      <button
        className="btn btn-clear text--color-primary"
        type="button"
        onClick={() => handleChangeDateRange(3)}
      >
        <span>{formatMessage({ id: 'ThisYear' })}</span>
      </button>
      <button className="btn btn-clear text--color-primary" type="button">
        <span>{formatMessage({ id: 'CustomFilter' })}</span>
      </button>
    </div>
  )
}

export default DateRangeModal
