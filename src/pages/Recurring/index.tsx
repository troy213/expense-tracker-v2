import { useIntl } from 'react-intl'
import { RecurringSvg } from '@/assets'
import { Navbar } from '@/components'
import './index.scss'

const Recurring = () => {
  const { formatMessage } = useIntl()

  return (
    <div className="recurring">
      <Navbar enableBackButton title="Recurring" />
      <div className="flex-column flex-justify-center flex-align-center flex-1 gap-2 mt-4 text--light">
        <RecurringSvg className="icon--2xl" />
        <span>{formatMessage({ id: 'FeatureComingSoon' })}</span>
      </div>
    </div>
  )
}

export default Recurring
