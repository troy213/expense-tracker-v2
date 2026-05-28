import { useRef } from 'react'
import { useIntl } from 'react-intl'
import { MoreVerticalSvg } from '@/assets'
import { DATE_RANGE, DATE_RANGE_ITEM } from '@/constants'
import DateRangeMenu from '@/components/Menu/DateRangeMenu'
import InputDateModal from '@/components/Modal/InputDateModal'
import { useAppDispatch, useClickOutside } from '@/hooks'
import useDisclosure from '@/hooks/useDisclosure'
import { reportAction } from '@/store/report/report-slice'
import { combineClassName, toDateKey } from '@/utils'
import './ReportTimeTab.scss'

type ReportTimeTabProps = {
  dateFrom: string | null
  dateTo: string | null
  dateRange: number
}

const ReportTimeTab = ({ dateFrom, dateTo, dateRange }: ReportTimeTabProps) => {
  const dateRangeModalRef = useRef<HTMLDivElement>(null)
  const { formatMessage } = useIntl()
  const dateModal = useDisclosure()
  const moreMenu = useDisclosure()
  const dispatch = useAppDispatch()

  useClickOutside(dateRangeModalRef, moreMenu.close, moreMenu.isOpen)

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
    dateRange === DATE_RANGE.ALL_TIME ? DATE_RANGE.THIS_MONTH : dateRange

  const handleMoreOption = () => moreMenu.toggle()

  const handleChangeDateRange = (range: number) => {
    moreMenu.close()
    dispatch(reportAction.setState({ state: 'dateRange', value: range }))
    if (range === DATE_RANGE.CUSTOM_FILTER) {
      dateModal.open()
    }
  }

  const setCustomDate = (from: string, to: string) => {
    dispatch(
      reportAction.setState({ state: 'customRange', value: { from, to } })
    )
  }

  return (
    <div className="report-time-tab">
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
        <div className="report-time-tab__tab">
          {[DATE_RANGE.ALL_TIME, dynamicRange].map((value) => {
            const item = DATE_RANGE_ITEM.find((d) => d.value === value)
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={dateRange === value}
                className={combineClassName('report-time-tab__tab-item', [
                  {
                    condition: dateRange === value,
                    className: 'selected',
                  },
                ])}
                onClick={() => handleChangeDateRange(value)}
              >
                {item && formatMessage({ id: item.title })}
              </button>
            )
          })}
        </div>
        <div className="relative" ref={dateRangeModalRef}>
          <button
            type="button"
            className="btn btn-clear"
            aria-label={formatMessage({ id: 'MoreOptions' })}
            onClick={handleMoreOption}
          >
            <MoreVerticalSvg className="icon--stroke-primary" />
          </button>
          {moreMenu.isOpen && (
            <DateRangeMenu
              data={DATE_RANGE_ITEM.filter(
                (item) =>
                  item.value !== DATE_RANGE.ALL_TIME &&
                  item.value !== dynamicRange
              )}
              dateRange={dateRange}
              handleChangeDateRange={handleChangeDateRange}
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

export default ReportTimeTab
