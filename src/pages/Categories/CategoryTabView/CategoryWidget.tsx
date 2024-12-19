import { CoinsSvg, MoreVerticalSvg } from '@/assets'
import { CategoryType } from '@/types'
import { currencyFormatter } from '@/utils'

type CategoryWidgetProps = {
  type: CategoryType
  name: string
  budget: number
}

const CategoryWidget: React.FC<CategoryWidgetProps> = ({
  type,
  name,
  budget,
}) => {
  return (
    <div className="category-widget p-4">
      <div className="flex-space-between flex-align-center">
        <div className="flex-column gap-2">
          <span>{name}</span>
          {type === 'expense' && (
            <div className="flex-align-center gap-2">
              <CoinsSvg className="icon--fill-primary" />
              <span className="text--light text--3">
                {currencyFormatter(budget)}
              </span>
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
