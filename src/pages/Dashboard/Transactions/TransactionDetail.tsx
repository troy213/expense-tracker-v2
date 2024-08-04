import { MoreVerticalSvg } from '@/assets'
import { Widget } from '@/components'

const TransactionDetail = () => {
  return (
    <Widget>
      <div className='transaction-detail flex-column gap-4'>
        <span className='text--italic text--light text--3'>Today</span>

        {/* transaction detail will be looped here */}
        <div className='flex-space-between flex-align-center'>
          <div className='flex-column gap-1'>
            <span>Food & Beverages</span>
            <span className='text--light text--3'>Pizza Hut</span>
          </div>
          <div className='flex-align-center gap-2'>
            <span className='text--color-danger'>-Rp100.000</span>
            <MoreVerticalSvg className='icon--stroke-primary' />
          </div>
        </div>
      </div>
    </Widget>
  )
}

export default TransactionDetail
