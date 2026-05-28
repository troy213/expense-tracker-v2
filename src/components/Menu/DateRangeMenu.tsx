import { useIntl } from 'react-intl'
import { CheckSvg } from '@/assets'
import './DateRangeMenu.scss'

type DateRangeMenuProps = {
  data: { title: string; value: number }[]
  dateRange: number
  handleChangeDateRange: (arg: number) => void
}

const DateRangeMenu: React.FC<DateRangeMenuProps> = ({
  data,
  dateRange,
  handleChangeDateRange,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="date-range-menu">
      {data.map((item, index) => {
        return (
          <button
            key={index}
            className="btn btn-clear flex-space-between"
            type="button"
            onClick={() => handleChangeDateRange(item.value)}
          >
            <span className="text--color-primary">
              {formatMessage({ id: item.title })}
            </span>
            {dateRange === item.value && (
              <CheckSvg className="icon icon--stroke-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default DateRangeMenu
