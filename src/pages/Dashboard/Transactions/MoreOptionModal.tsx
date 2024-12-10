import { EditSvg, TrashSvg } from '@/assets'
import { combineClassName } from '@/utils'

type MoreOptionModalProps = {
  className: string
}

const MoreOptionModal: React.FC<MoreOptionModalProps> = ({
  className = '',
}) => {
  const moreOptionModalClassName = combineClassName('more-option-modal', [
    className,
  ])

  return (
    <div className={moreOptionModalClassName}>
      <button className="btn btn-clear text--color-primary" type="button">
        <EditSvg className="icon icon--stroke-primary" />
        <span>Edit</span>
      </button>
      <button className="btn btn-clear text--color-danger" type="button">
        <TrashSvg className="icon icon--stroke-danger" />
        <span>Delete</span>
      </button>
    </div>
  )
}

export default MoreOptionModal
