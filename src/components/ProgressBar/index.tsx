type ProgressBarProps = {
  amount: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ amount }) => {
  const progressWidth = `${amount}%`

  return (
    <div className='progress-bar'>
      <div className='progress-bar__fill' style={{ width: progressWidth }} />
    </div>
  )
}

export default ProgressBar
