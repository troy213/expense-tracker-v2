import { useIntl } from 'react-intl'
import { CheckSvg } from '@/assets'
import { DATE_RANGE } from '@/constants'
import './DateRangeMenu.scss'

type DateRangeMenuProps = {
  dateRange: number
  handleChangeDateRange: (arg: number) => void
}

const DATE_RANGE_ITEM = [
  {
    title: 'All',
    value: DATE_RANGE.ALL_TIME,
  },
  {
    title: 'ThisMonth',
    value: DATE_RANGE.THIS_MONTH,
  },
  {
    title: 'LastMonth',
    value: DATE_RANGE.LAST_MONTH,
  },
  {
    title: 'ThisYear',
    value: DATE_RANGE.THIS_YEAR,
  },
  {
    title: 'CustomFilter',
    value: DATE_RANGE.CUSTOM_FILTER,
  },
]

const DateRangeMenu: React.FC<DateRangeMenuProps> = ({
  dateRange,
  handleChangeDateRange,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="date-range-menu">
      {DATE_RANGE_ITEM.map((item, index) => {
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
