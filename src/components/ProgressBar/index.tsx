import { combineClassName } from '@/utils'
import './index.scss'

type ProgressBarProps = {
  amount: number
  options?: {
    enableStyle?: boolean
    progressClassName?: string
  }
}

const ProgressBar: React.FC<ProgressBarProps> = ({ amount, options = {} }) => {
  const { enableStyle = true, progressClassName = '' } = options
  const progressWidth = `${amount}%`
  const isWarning = amount > 0 && amount <= 25
  const isDanger = amount <= 0

  const fillClassName = combineClassName('progress-bar__fill', [
    {
      condition: enableStyle && isWarning,
      className: 'progress-bar__fill--warning',
    },
    {
      condition: enableStyle && isDanger,
      className: 'progress-bar__fill--danger',
    },
    {
      condition: progressClassName !== '',
      className: progressClassName,
    },
  ])

  return (
    <div className="progress-bar">
      <div className={fillClassName} style={{ width: progressWidth }} />
    </div>
  )
}

export default ProgressBar
