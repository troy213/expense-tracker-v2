import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { CrossSvg, PlusSvg } from '@/assets'
import { REGEX } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { mainAction } from '@/store/main/main-slice'
import { CategoryType, TransactionForm, TxDetailsForm } from '@/types'
import {
  calculateRemainingBudget,
  combineClassName,
  currencyFormatter,
  getDate,
} from '@/utils'
import Modal from '.'
import Form from '../Form'
import { Link } from 'react-router-dom'

type FormTransactionModalProps = {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  indexes?: {
    dataIndex: number
    subdataIndex: number
  }
}

type ErrorState = Record<keyof TransactionForm, string>
type TxDetailsErrorState = Record<keyof TxDetailsForm, string>

const dataInitialValue: TransactionForm = {
  type: 'income',
  category: '',
  date: String(getDate()),
}

const txDetailsInitialValue: TxDetailsForm[] = [
  {
    description: '',
    amount: 0,
  },
]

const errorInitialValue: ErrorState = {
  type: '',
  category: '',
  date: '',
}

const txDetailsErrorInitialValue: TxDetailsErrorState[] = [
  {
    description: '',
    amount: '',
  },
]

const FormTransactionModal: React.FC<FormTransactionModalProps> = ({
  isOpen,
  setIsOpen,
  indexes,
}) => {
  const isEditForm = indexes !== undefined
  const transactionsData = useAppSelector((state) => state.mainReducer.data)
  const categories = useAppSelector(
    (state) => state.categoriesReducer.categories
  )

  let currentData = dataInitialValue
  let currentTxDetails = txDetailsInitialValue
  let currentTxDetailsError = txDetailsErrorInitialValue

  if (isEditForm) {
    const { dataIndex, subdataIndex } = indexes!
    const { date, subdata } = transactionsData[dataIndex]

    currentData = {
      date,
      category: subdata[subdataIndex].category,
      type: subdata[subdataIndex].type,
    }

    currentTxDetails = subdata[subdataIndex].item
    currentTxDetailsError = subdata[subdataIndex].item.map(() => ({
      description: '',
      amount: '',
    }))
  }

  const [data, setData] = useState<TransactionForm>(currentData)
  const [error, setError] = useState<ErrorState>(errorInitialValue)
  const [transactionDetails, setTransactionDetails] =
    useState<TxDetailsForm[]>(currentTxDetails)
  const [txDetailsError, setTxDetailsError] = useState<TxDetailsErrorState[]>(
    currentTxDetailsError
  )
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const filteredCategory = categories.filter(
    (category) => category.type === data.type
  )
  const categoryList = filteredCategory.map((category) => category.name)

  const budget = categories.filter(
    (category) => category.name === data.category
  )[0]?.budget

  const remainingBudget = useMemo(
    () =>
      calculateRemainingBudget(
        transactionsData,
        transactionDetails,
        [data.category],
        budget,
        data.date,
        isEditForm
          ? transactionsData[indexes.dataIndex].subdata[indexes.subdataIndex].id
          : ''
      ),
    [
      data.category,
      data.date,
      budget,
      transactionsData,
      transactionDetails,
      isEditForm,
      indexes,
    ]
  )

  const remainingBudgetClassName = combineClassName('', [
    {
      condition: remainingBudget >= 0,
      className: 'text--color-primary',
    },
    {
      condition: remainingBudget < 0,
      className: 'text--color-danger',
    },
  ])

  const handleAddDetail = () => {
    setTransactionDetails((prevState) => [
      ...prevState,
      { description: '', amount: 0 },
    ])
    setTxDetailsError((prevState) => [
      ...prevState,
      { description: '', amount: '' },
    ])
  }

  const handleRemoveDetail = (index: number) => {
    setTransactionDetails(transactionDetails.filter((_, idx) => idx !== index))
    setTxDetailsError(txDetailsError.filter((_, idx) => idx !== index))
  }

  const handleDataChange = <K extends keyof TransactionForm>(
    key: K,
    value: TransactionForm[K]
  ) => {
    setData((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const handleTxDetailsChange = <K extends keyof TxDetailsForm>(
    key: K,
    value: TxDetailsForm[K],
    index: number
  ) => {
    const newTxDetail = transactionDetails.map((txDetail, idx) => {
      if (idx === index) return { ...txDetail, [key]: value }
      return txDetail
    })

    setTransactionDetails(newTxDetail)
  }

  const handleError = <K extends keyof ErrorState>(
    key: K,
    value: ErrorState[K]
  ) => {
    setError((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }

  const handleTxDetailsErrorChange = <K extends keyof TxDetailsErrorState>(
    key: K,
    value: TxDetailsErrorState[K],
    index: number
  ) => {
    const newTxDetailError = [...txDetailsError]
    newTxDetailError[index][key] = value

    setTxDetailsError(newTxDetailError)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let formIsValid = true

    // check any empty data
    Object.entries(data).forEach(([key, value]) => {
      if (value === '') {
        setError((prevState) => ({
          ...prevState,
          [key]: formatMessage({ id: 'FormEmptyError' }),
        }))
        formIsValid = false
      }
    })

    // check any empty data
    transactionDetails.forEach((vehicle, index) => {
      Object.entries(vehicle).forEach(([key, value]) => {
        if (value === '') {
          const newTxDetailsError = [...txDetailsError]
          newTxDetailsError[index][key as keyof TxDetailsErrorState] =
            formatMessage({ id: 'FormEmptyError' })

          setTxDetailsError(newTxDetailsError)
          formIsValid = false
        }
      })
    })

    // check any error
    Object.entries(error).forEach(([, value]) => {
      if (value) formIsValid = false
    })

    // check any error
    txDetailsError.forEach((txDetailError) => {
      Object.entries(txDetailError).forEach(([, value]) => {
        if (value) formIsValid = false
      })
    })

    if (formIsValid) {
      dispatch(mainAction.setData({ data, transactionDetails, indexes }))

      handleCancel(e)
    }
  }

  const resetData = () => {
    setData({ type: 'income', category: '', date: String(getDate()) })
    setTransactionDetails([{ description: '', amount: 0 }])
    setError({ date: '', category: '', type: '' })
    setTxDetailsError([{ description: '', amount: '' }])
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault()
    resetData()
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen) {
      const defaultCategory =
        categories.filter((category) => category.type === data.type)[0]?.name ??
        ''

      if (!isEditForm) {
        setData((prevState) => ({
          ...prevState,
          category: defaultCategory,
        }))
      }
    } else {
      resetData()
    }
  }, [data.type, isOpen, categories, isEditForm])

  if (!filteredCategory.length) {
    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex-column gap-2">
          <span className="text--bold text--color-primary">
            {formatMessage({ id: 'AddTransaction' })}
          </span>
          <span className="text--light text--color-primary text--3">
            {formatMessage({ id: 'NoCategoryWarningMessage' })}
          </span>
          <Link
            to={`/categories?cat=${data.type}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="text--underline text--color-primary text--3">
              {formatMessage({ id: 'AddCategory' })}
            </span>
          </Link>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}
    >
      <form
        className="flex-column gap-4"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      >
        <span className="text--bold text--color-primary">
          {formatMessage({
            id: `${isEditForm ? 'EditTransaction' : 'AddTransaction'}`,
          })}
        </span>
        <Form.Radio
          groupId="transaction-type"
          defaultValue={data.type}
          onChange={(val) => handleDataChange('type', val)}
          options={['income', 'expense'] satisfies CategoryType[]}
          errorMessage={error.type}
          setError={(val) => handleError('type', val)}
          label={formatMessage({ id: 'Transaction' })}
          radioOptionsContainerClassName="flex-row"
        />

        <Form.Input
          type="date"
          value={data.date}
          onChange={(val) => handleDataChange('date', val)}
          errorMessage={error.date}
          setError={(val) => handleError('date', val)}
          label={formatMessage({ id: 'Date' })}
          id="date"
        />

        <Form.Select
          value={data.category}
          onChange={(val) => handleDataChange('category', val)}
          options={categoryList}
          errorMessage={error.category}
          setError={(val) => handleError('category', val)}
          placeholder="category"
          label={formatMessage({ id: 'Category' })}
        />

        {data.type === 'expense' && (
          <div className="flex-column gap-2">
            <span className="text--color-primary text--light text--3">
              {formatMessage({ id: 'RemainingBudgetForThisCategory' })}
            </span>
            <span className={remainingBudgetClassName}>
              {currencyFormatter(remainingBudget ?? 0)}
            </span>
          </div>
        )}

        {transactionDetails.map((_, idx) => {
          return (
            <div key={idx} className="modal__detail">
              <div className="flex-space-between">
                <span className="text--color-primary">
                  {formatMessage(
                    { id: 'TransactionDetailNo' },
                    { index: idx + 1 }
                  )}
                </span>
                {idx > 0 && (
                  <button
                    className="btn btn-clear"
                    onClick={() => {
                      handleRemoveDetail(idx)
                    }}
                  >
                    <CrossSvg className="icon icon--stroke-primary" />
                  </button>
                )}
              </div>

              <Form.Input
                type="text"
                value={transactionDetails[idx].description}
                onChange={(val) =>
                  handleTxDetailsChange('description', val, idx)
                }
                pattern={REGEX.COMMON_TEXT.PATTERN}
                patternErrorMessage={formatMessage({
                  id: REGEX.COMMON_TEXT.ERROR_MESSAGE,
                })}
                errorMessage={txDetailsError[idx]?.description}
                setError={(val) =>
                  handleTxDetailsErrorChange('description', val, idx)
                }
                label={formatMessage({ id: 'Description' })}
                id="description"
              />

              <Form.Input
                type="currency"
                value={transactionDetails[idx].amount}
                onChange={(val) =>
                  handleTxDetailsChange('amount', Number(val), idx)
                }
                pattern={REGEX.NUMBER.PATTERN}
                patternErrorMessage={formatMessage({
                  id: REGEX.NUMBER.ERROR_MESSAGE,
                })}
                errorMessage={txDetailsError[idx]?.amount}
                setError={(val) =>
                  handleTxDetailsErrorChange('amount', val, idx)
                }
                label={formatMessage({ id: 'AmountRp' })}
                id="amount"
              />
            </div>
          )
        })}
        <div onClick={handleAddDetail} className="btn btn-dashed p-4">
          <PlusSvg className="icon--stroke-primary" />
          <span className="text--color-primary text--light text--3">
            {formatMessage({ id: 'AddMoreTransaction' })}
          </span>
        </div>
        <div className="flex-column gap-4 mt-4">
          <button type="submit" className="btn btn-primary">
            {formatMessage({ id: `${isEditForm ? 'Update' : 'Submit'}` })}
          </button>
          <button className="btn btn-outline-primary" onClick={handleCancel}>
            {formatMessage({ id: 'Cancel' })}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default FormTransactionModal
