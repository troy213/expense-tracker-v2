import { CoinsSvg, MoreVerticalSvg } from '@/assets'

type CategoryWidgetProps = {
  type: 'income' | 'outcome'
}

const CategoryWidget: React.FC<CategoryWidgetProps> = ({ type }) => {
  return (
    <div className="category-widget p-4">
      <div className="flex-space-between flex-align-center">
        <div className="flex-column gap-2">
          <span>Food & Beverages</span>
          {type === 'outcome' && (
            <div className="flex-align-center gap-2">
              <CoinsSvg className="icon--fill-primary" />
              <span className="text--light text--3">Rp1.234.567</span>
            </div>
          )}
        </div>

        <button type="button" className="btn btn-clear">
          <MoreVerticalSvg className="icon--stroke-primary" />
        </button>
      </div>
    </div>
  )
}

export default CategoryWidget
