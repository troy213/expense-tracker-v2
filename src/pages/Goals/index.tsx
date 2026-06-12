import { useState } from 'react'
import { useIntl } from 'react-intl'
import { PiggyBankSvg, PlusSvg } from '@/assets'
import { FormModal, Navbar, Widget } from '@/components'
import { useAppSelector, useDisclosure } from '@/hooks'
import { currencyFormatter } from '@/utils'
import GoalItem from './GoalItem'
import './index.scss'

const Goals = () => {
  const { formatMessage } = useIntl()
  const addModal = useDisclosure()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const goals = useAppSelector((s) => s.goalsReducer.goals)
  const totalSaved = useAppSelector((s) => s.goalsReducer.totalSaved)

  return (
    <div className="goals">
      <FormModal.FormGoal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        onCancel={addModal.close}
      />

      <div className="flex-column flex-1 gap-4 p-4">
        <Navbar enableBackButton title="Goals" />

        <div>
          <Widget className="bg-primary text--color-white p-4">
            <div className="flex-justify-center flex-align-center gap-4">
              <PiggyBankSvg
                className="goals__total-saved-icon"
                aria-hidden="true"
              />
              <div className="flex-column">
                <span className="text--light text--3">
                  {formatMessage({ id: 'TotalSaved' })}
                </span>
                <span className="text--bold">
                  {currencyFormatter(totalSaved)}
                </span>
              </div>
            </div>
          </Widget>
        </div>

        <div className="flex-column flex-1 gap-4 mt-2">
          <button
            type="button"
            className="goals__add-button"
            onClick={() => addModal.open()}
          >
            <div className="flex-align-center gap-2">
              <PlusSvg className="icon--color-primary" aria-hidden="true" />
              <span className="text--color-primary text--light text--3">
                {formatMessage({ id: 'AddGoal' })}
              </span>
            </div>
          </button>

          {goals.length === 0 ? (
            <div className="flex-column flex-1 flex-justify-center flex-align-center gap-2 mt-4 text--light">
              <span className="text--3">
                {formatMessage({ id: 'NoGoals' })}
              </span>
            </div>
          ) : (
            <div className="flex-column gap-3">
              {goals.map((goal) => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  isMenuOpen={openMenuId === goal.id}
                  onMenuToggle={setOpenMenuId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Goals
