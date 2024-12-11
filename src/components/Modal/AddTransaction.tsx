import { useState } from 'react'
import Modal from '.'
import { CrossSvg, PlusSvg } from '@/assets'
type ModalProps = {
  isOpen: boolean
  handleOpenModal: () => void
}

const AddtransactionModal: React.FC<ModalProps> = ({
  isOpen,
  handleOpenModal,
}) => {
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
    console.log(data.get('transactionType'))
    console.log(data.get('transactionDate'))
    console.log(data.get('transactionCategory'))
    console.log({ transactionDetails })
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
            <fieldset className="flex gap-8">
              <legend>Transaction Type:</legend>

              <label>
                <input
                  type="radio"
                  name="transactionType"
                  value="Income"
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
                  value="Expense"
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

            <fieldset>
              <legend>Date:</legend>
              <label>
                <input type="date" name="transactionDate" />
              </label>
            </fieldset>
            <fieldset>
              <legend>Category:</legend>
              <label>
                <select name="transactionCategory">
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Others</option>
                </select>
              </label>
            </fieldset>
            {transactionDetails.map((detail, idx) => {
              return (
                <div key={idx} className="details">
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
                      name={`desc_${idx}`}
                      value={detail.description}
                      onChange={(e) => {
                        handleOnchange(idx, 'description', e.target.value)
                      }}
                    />
                  </label>
                  <label>
                    Amount:
                    <input
                      type="number"
                      name={`amount_${idx}`}
                      value={detail.amount}
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
