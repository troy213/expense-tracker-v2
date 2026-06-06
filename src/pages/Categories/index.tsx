import { useIntl } from 'react-intl'
import { PlusSvg } from '@/assets'
import { FormModal, Modal, Navbar } from '@/components'
import { useCategoriesContext } from './CategoriesContext'
import { CategoriesProvider } from './CategoriesProvider'
import { useDisclosure } from '@/hooks'
import { currencyFormatter } from '@/utils'
import CategoryTabFilter from './CategoryTabFilter'
import CategoryContainer from './CategoriesContainer'
import './index.scss'

const CategoriesPage = () => {
  const { formatMessage } = useIntl()
  const { selectedCategory, filteredCategory } = useCategoriesContext()
  const addModal = useDisclosure()

  const totalBudget = filteredCategory.reduce(
    (acc, curr) => acc + (curr.budget ?? 0),
    0
  )

  return (
    <div className="categories">
      <Modal isOpen={addModal.isOpen} onClose={addModal.close}>
        <FormModal.FormCategory
          type={selectedCategory}
          onCancel={addModal.close}
        />
      </Modal>

      <div className="flex-column flex-1 gap-4 p-4">
        <Navbar enableBackButton={true} title="CategoryAndBudget" />

        <CategoryTabFilter />

        <div className="flex-column gap-4 mt-2">
          {/* The budget summary is only relevant on the expense tab. */}
          {selectedCategory === 'expense' && (
            <div className="categories__budget-widget">
              <div className="flex-column flex-align-center gap-2">
                <span className="text--light text--3">
                  {formatMessage({ id: 'TotalMaxBudget' })}
                </span>
                <span>{currencyFormatter(totalBudget)}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            className="categories__add-button"
            onClick={() => addModal.open()}
          >
            <div className="flex-align-center gap-2">
              <PlusSvg className="icon--color-primary" />
              <span className="text--color-primary text--light text--3">
                {formatMessage({ id: 'AddCategory' })}
              </span>
            </div>
          </button>

          <CategoryContainer />
        </div>
      </div>
    </div>
  )
}

const Categories = () => (
  <CategoriesProvider>
    <CategoriesPage />
  </CategoriesProvider>
)

export default Categories
