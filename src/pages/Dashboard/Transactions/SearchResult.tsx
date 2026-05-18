import { useIntl } from 'react-intl'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { searchDBTransactions } from '@/store/main/main-thunk'
import { SearchSvg } from '@/assets'

const SearchResult = () => {
  const { searchValue } = useAppSelector((state) => state.mainReducer)
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()

  const handleClearSearch = () => {
    dispatch(searchDBTransactions({ searchValue: '' }))
  }

  if (!searchValue) return null

  return (
    <div className="search-result">
      <div className="flex-align-center gap-2">
        <SearchSvg className="icon--stroke-primary icon--sm" />
        <span className="text--italic text--light text--3">
          {formatMessage(
            { id: 'SearchResult' },
            { result: <strong>{searchValue}</strong> }
          )}
        </span>
      </div>
      <button className="btn btn-clear" onClick={handleClearSearch}>
        <span className="text--underline text--italic text--light text--color-primary text--3">
          {formatMessage({ id: 'Cancel' })}
        </span>
      </button>
    </div>
  )
}

export default SearchResult
