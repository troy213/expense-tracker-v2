import { useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import { MoreVerticalSvg } from '@/assets'
import { TIME_FILTER, TIME_FILTER_ITEM } from '@/constants'
import TimeFilterMenu from '@/components/Menu/TimeFilterMenu'
import InputDateModal from '@/components/Modal/InputDateModal'
import { useAppDispatch, useClickOutside } from '@/hooks'
import useDisclosure from '@/hooks/useDisclosure'
import { reportAction } from '@/store/report/report-slice'
import { combineClassName, toDateKey } from '@/utils'
import './TimeFilterTab.scss'

type TimeFilterTabProps = {
  dateFrom: string | null
  dateTo: string | null
  timeFilter: number
}

const TimeFilterTab = ({
  dateFrom,
  dateTo,
  timeFilter,
}: TimeFilterTabProps) => {
  const timeFilterMenuRef = useRef<HTMLDivElement>(null)
  const { formatMessage } = useIntl()
  const dateModal = useDisclosure()
  const moreMenu = useDisclosure()
  const dispatch = useAppDispatch()

  useClickOutside(timeFilterMenuRef, moreMenu.close, moreMenu.isOpen)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }

  const formatLabel = (key: string) =>
    new Date(`${key}T00:00:00`).toLocaleString('en-US', options)

  const firstDate = dateFrom ? formatLabel(dateFrom) : ''
  const lastDate = dateTo ? formatLabel(dateTo) : ''

  // The second tab is a dynamic slot: it shows the active range, falling back
  // to This Month whenever All Time is selected.
  const dynamicRange =
    timeFilter === TIME_FILTER.ALL_TIME ? TIME_FILTER.THIS_MONTH : timeFilter

  const handleMoreOption = () => moreMenu.toggle()

  const handleTimeFilterChange = (range: number) => {
    moreMenu.close()
    dispatch(reportAction.setState({ state: 'timeFilter', value: range }))
    if (range === TIME_FILTER.CUSTOM_FILTER) {
      dateModal.open()
    }
  }

  const setCustomDate = (from: string, to: string) => {
    dispatch(
      reportAction.setState({ state: 'customRange', value: { from, to } })
    )
  }

  useEffect(() => {
    dispatch(reportAction.setState({ state: 'customRange', value: null }))
  }, [dispatch, timeFilter])

  return (
    <div className="time-filter-tab">
      {dateModal.isOpen && (
        <InputDateModal
          isOpen={dateModal.isOpen}
          onClose={dateModal.close}
          SetCustomDate={(from: Date, to: Date) =>
            setCustomDate(toDateKey(from), toDateKey(to))
          }
        />
      )}

      <div className="flex-align-center gap-2">
        <div className="time-filter-tab__tab">
          {[TIME_FILTER.ALL_TIME, dynamicRange].map((value) => {
            const item = TIME_FILTER_ITEM.find((d) => d.value === value)
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={timeFilter === value}
                className={combineClassName('time-filter-tab__tab-item', [
                  {
                    condition: timeFilter === value,
                    className: 'selected',
                  },
                ])}
                onClick={() => handleTimeFilterChange(value)}
              >
                {item && formatMessage({ id: item.title })}
              </button>
            )
          })}
        </div>
        <div className="relative" ref={timeFilterMenuRef}>
          <button
            type="button"
            className="btn btn-clear"
            aria-label={formatMessage({ id: 'MoreOptions' })}
            onClick={handleMoreOption}
          >
            <MoreVerticalSvg className="icon--color-primary" />
          </button>
          {moreMenu.isOpen && (
            <TimeFilterMenu
              data={TIME_FILTER_ITEM.filter(
                (item) =>
                  item.value !== TIME_FILTER.ALL_TIME &&
                  item.value !== dynamicRange
              )}
              timeFilter={timeFilter}
              handleTimeFilterChange={handleTimeFilterChange}
            />
          )}
        </div>
      </div>

      <span className="text--light text--3">
        {firstDate && lastDate
          ? `${firstDate} - ${lastDate}`
          : formatMessage({ id: 'AllTime' })}
      </span>
    </div>
  )
}

export default TimeFilterTab
