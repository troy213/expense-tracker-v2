import { useIntl } from 'react-intl'
import { LoanSvg } from '@/assets'
import { Navbar } from '@/components'
import './index.scss'

const Loans = () => {
  const { formatMessage } = useIntl()

  return (
    <div className="loans">
      <Navbar enableBackButton title="Loans" />
      <div className="flex-column flex-justify-center flex-align-center flex-1 gap-2 mt-4 text--light">
        <LoanSvg className="icon--2xl" />
        <span>{formatMessage({ id: 'FeatureComingSoon' })}</span>
      </div>
    </div>
  )
}

export default Loans
