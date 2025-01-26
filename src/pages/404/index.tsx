import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const { formatMessage } = useIntl()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="not-found">
      <div className="flex-column flex-align-center">
        <h1 className="text--color-white">404</h1>
        <p className="text--light text--3 text--color-white">
          {formatMessage({ id: 'PageNotFound' })}
        </p>
      </div>
      <button className="btn btn-outline-white" onClick={handleBack}>
        {formatMessage({ id: 'Back' })}
      </button>
    </div>
  )
}

export default NotFound
