import { EditSvg, TrashSvg } from '@/assets'

const MoreOptionModal = () => {
  return (
    <div className="more-option-modal">
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
