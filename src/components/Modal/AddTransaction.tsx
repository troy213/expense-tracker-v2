import { useState } from 'react'
import Modal from '.'
import { CrossSvg, PlusSvg } from '@/assets'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { CategoryType, Data } from '@/types'
import { mainAction } from '@/store/main/main-slice'

type ModalProps = {
  isOpen: boolean
  handleOpenModal: () => void
}

const AddtransactionModal: React.FC<ModalProps> = ({
  isOpen,
  handleOpenModal,
}) => {
  const txData = useAppSelector((state) => state.mainReducer.data)
  const category = useAppSelector((state) => state.categoriesReducer.categories)
  const today = new Date().toISOString().split('T')[0]
  const dispatch = useAppDispatch()
  const [transactionDetails, setTransactionDetails] = useState([
    { description: '', amount: '' },
  ])
  const [isExpense, setIsExpense] = useState(false)

  const handleOnRadioChange = () => {
    setIsExpense(!isExpense)
  }

  const handleOnchange = (
    index: number,
    field: 'description' | 'amount',
    value: string
  ) => {
    const updatedDetail = [...transactionDetails]
    updatedDetail[index][field] = value
    setTransactionDetails(updatedDetail)
  }

  const handleAddDetail = () => {
    setTransactionDetails([
      ...transactionDetails,
      { description: '', amount: '' },
    ])
  }

  const handleRemoveDetail = (index: number) => {
    setTransactionDetails(transactionDetails.filter((_, idx) => idx !== index))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const item = transactionDetails.map((detail) => ({
      description: detail.description,
      amount: parseFloat(detail.amount),
    }))
    const newSubData = {
      id: crypto.randomUUID() as string,
      type: data.get('transactionType') as CategoryType,
      category: data.get('transactionCategory') as string,
      item: item,
    }

    const newTx = {
      id: crypto.randomUUID() as string,
      date: new Date(data.get('transactionDate') as string).toISOString(),
      subdata: [newSubData],
    }

    const existingTxIndex = txData.findIndex((tx) => tx.date === newTx.date)
    let updatedData: Data[]
    if (existingTxIndex !== -1) {
      const existingTx = txData[existingTxIndex]
      const updatedSubdata = [...existingTx.subdata, newSubData]
      const updatedTx = { ...existingTx, subdata: updatedSubdata }
      updatedData = [...txData]
      updatedData[existingTxIndex] = updatedTx
    } else {
      updatedData = [...txData, newTx]
    }

    dispatch(mainAction.setData(updatedData))

    setTransactionDetails([{ description: '', amount: '' }])
    handleOpenModal()
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          handleOpenModal()
        }}
      >
        <div className="modal__content">
          <header className="modal__header flex-justify-center">
            <h1 className="modal__title">Add Transaction</h1>
          </header>

          <form onSubmit={handleSubmit}>
            <fieldset className="modal__fieldset flex gap-8">
              <legend>Transaction Type:</legend>

              <label>
                <input
                  type="radio"
                  name="transactionType"
                  value="income"
                  className="mr-2"
                  onChange={handleOnRadioChange}
                  checked={!isExpense}
                />
                Income
              </label>

              <label>
                <input
                  type="radio"
                  name="transactionType"
                  value="expense"
                  className="mr-2"
                  onChange={handleOnRadioChange}
                  checked={isExpense}
                />
                Expense
              </label>
            </fieldset>
            {isExpense ? (
              <div className="p-2 mb-2">
                <div>Remaining budget for this category: </div>
                <h5>Rp. 999999</h5>
              </div>
            ) : (
              ''
            )}

            <fieldset className="modal__fieldset">
              <legend>Date:</legend>
              <label>
                <input
                  className="modal__input"
                  type="date"
                  name="transactionDate"
                  max={today}
                  required
                />
              </label>
            </fieldset>
            <fieldset className="modal__fieldset">
              <legend>Category:</legend>
              <label>
                <select className="modal__input" name="transactionCategory">
                  {category
                    .filter((cat) =>
                      isExpense ? cat.type === 'expense' : cat.type === 'income'
                    )
                    .map((cat) => {
                      return <option key={cat.id}>{cat.name}</option>
                    })}
                </select>
              </label>
            </fieldset>
            {transactionDetails.map((detail, idx) => {
              return (
                <div key={idx} className="modal__detail">
                  <legend className="flex-space-between width-100">
                    Transaction Detail #{idx + 1}:{' '}
                    {transactionDetails.length > 1 ? (
                      <div
                        onClick={() => {
                          handleRemoveDetail(idx)
                        }}
                      >
                        <CrossSvg />
                      </div>
                    ) : (
                      ''
                    )}
                  </legend>

                  <label>
                    Description:
                    <input
                      type="text"
                      className="modal__input"
                      name={`desc_${idx}`}
                      value={detail.description}
                      required
                      onChange={(e) => {
                        handleOnchange(idx, 'description', e.target.value)
                      }}
                    />
                  </label>
                  <label>
                    Amount:
                    <input
                      type="number"
                      className="modal__input"
                      name={`amount_${idx}`}
                      value={detail.amount}
                      required
                      onChange={(e) => {
                        handleOnchange(idx, 'amount', e.target.value)
                      }}
                    />
                  </label>
                </div>
              )
            })}
            <div
              onClick={handleAddDetail}
              className="width-100 flex-justify-center flex-align-center btn btn-dashed p-4 mb-8"
            >
              <PlusSvg />
              <span>Add more transaction</span>
            </div>
            <div className="flex-column gap-1">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                className="btn"
                onClick={() => {
                  handleOpenModal()
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}

export default AddtransactionModal
