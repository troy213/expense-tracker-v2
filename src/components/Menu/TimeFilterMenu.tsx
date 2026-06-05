import { useIntl } from 'react-intl'
import { CheckSvg } from '@/assets'
import './TimeFilterMenu.scss'

type TimeFilterMenuProps = {
  data: { title: string; value: number }[]
  timeFilter: number
  handleTimeFilterChange: (arg: number) => void
}

const TimeFilterMenu: React.FC<TimeFilterMenuProps> = ({
  data,
  timeFilter,
  handleTimeFilterChange,
}) => {
  const { formatMessage } = useIntl()

  return (
    <div className="time-filter-menu">
      {data.map((item, index) => {
        return (
          <button
            key={index}
            className="btn btn-clear flex-space-between"
            type="button"
            onClick={() => handleTimeFilterChange(item.value)}
          >
            <span className="text--color-primary">
              {formatMessage({ id: item.title })}
            </span>
            {timeFilter === item.value && (
              <CheckSvg className="icon icon--color-primary" />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default TimeFilterMenu
