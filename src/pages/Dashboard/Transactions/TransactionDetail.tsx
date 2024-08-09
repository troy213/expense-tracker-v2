import { MoreVerticalSvg } from '@/assets'

const TransactionDetail = () => {
  return (
    <div className="transaction-detail">
      <div className="flex-column gap-4">
        <span className="text--italic text--light text--3">Today</span>

        {/* transaction detail will be looped here */}
        <div className="flex-space-between flex-align-center">
          <div className="flex-column gap-1">
            <span>Food & Beverages</span>
            <span className="text--light text--3">Pizza Hut</span>
          </div>
          <div className="flex-align-center gap-2">
            <span className="text--color-danger">-Rp100.000</span>
            <button className="btn btn-clear">
              <MoreVerticalSvg className="icon--stroke-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetail
