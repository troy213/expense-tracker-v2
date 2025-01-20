import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useAppDispatch } from '@/hooks'
import { mainAction } from '@/store/main/main-slice'
import Modal from '.'
import Form from '../Form'

type SearchModalProps = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

const SearchModal = ({ isOpen, setIsOpen }: SearchModalProps) => {
  const [search, setSearch] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(mainAction.searchData({ searchValue: search }))
    setIsOpen(false)
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch('')
    setError('')
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form className="input-category-modal" onSubmit={handleSubmit}>
        <span className="text--bold text--color-primary">
          {formatMessage({ id: 'Search' })}
        </span>
        <Form.Input
          type="text"
          placeholder="Search"
          label={formatMessage({ id: 'TransactionName' })}
          value={search}
          onChange={(val) => setSearch(val)}
          errorMessage={error}
          setError={(val) => setError(val)}
          id="search"
        />
        <div className="flex-column gap-4 mt-4">
          <button type="submit" className="btn btn-primary">
            {formatMessage({ id: 'Search' })}
          </button>
          <button className="btn btn-outline-primary" onClick={handleCancel}>
            {formatMessage({ id: 'Cancel' })}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default SearchModal
