import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { SpinnerSvg } from '@/assets'
import { Navbar } from '@/components'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getDBGoalDetail } from '@/store/goal-detail/goal-detail-thunk'
import { goalDetailAction } from '@/store/goal-detail/goal-detail-slice'
import GoalCard from './GoalCard'
import GoalAction from './GoalAction'
import GoalHistory from './GoalHistory'
import './index.scss'

const GoalDetail = () => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const { formatMessage } = useIntl()
  const dispatch = useAppDispatch()

  const goal = useAppSelector((s) =>
    s.goalsReducer.goals.find((g) => g.id === id)
  )
  const { isLoading: isDetailLoading } = useAppSelector(
    (s) => s.goalDetailReducer
  )

  useEffect(() => {
    if (id) dispatch(getDBGoalDetail(id))
  }, [dispatch, id, goal])

  useEffect(() => {
    return () => {
      dispatch(goalDetailAction.resetDetail())
    }
  }, [dispatch])

  if (!id || !goal) {
    return (
      <div className="goal-detail flex-column gap-4 p-4">
        <Navbar enableBackButton title="Goals" />
        <div className="flex-align-center flex-justify-center flex-1">
          <span className="text--light text--3">
            {formatMessage({ id: 'NoGoalDetail' })}
          </span>
        </div>
      </div>
    )
  }

  if (isDetailLoading) {
    return (
      <div className="goal-detail p-4">
        <Navbar enableBackButton title="GoalDetail" />
        <div className="flex-justify-center flex-align-center flex-1">
          <SpinnerSvg className="icon--xl icon--color-primary spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="goal-detail flex-column gap-6 p-4">
      <Navbar enableBackButton title="GoalDetail" />
      <GoalCard goal={goal} />
      <GoalAction goal={goal} />
      <GoalHistory />
    </div>
  )
}

export default GoalDetail
