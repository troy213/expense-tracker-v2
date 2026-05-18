import { combineClassName } from '@/utils'

type ProgressBarProps = {
  amount: number
  options?: {
    enableStyle?: boolean
  }
}

const ProgressBar: React.FC<ProgressBarProps> = ({ amount, options = {} }) => {
  const { enableStyle = true } = options
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
  ])

  return (
    <div className="progress-bar">
      <div className={fillClassName} style={{ width: progressWidth }} />
    </div>
  )
}

export default ProgressBar
