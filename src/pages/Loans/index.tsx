import { useIntl } from 'react-intl'
import { Navbar } from '@/components'
import { LoanSvg } from '@/assets'

const Loans = () => {
  const { formatMessage } = useIntl()

  return (
    <div className="flex-column gap-4 p-4">
      <Navbar enableBackButton title="Loans" />
      <div className="flex-column flex-align-center gap-2 mt-4 text--light">
        <LoanSvg className="icon--2xl" />
        <span>{formatMessage({ id: 'FeatureComingSoon' })}</span>
      </div>
    </div>
  )
}

export default Loans
