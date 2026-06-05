import ReactDOM from 'react-dom'
import { useIntl } from 'react-intl'
import { CrossSvg, ImportSvg } from '@/assets'
import { usePWAInstall } from '@/hooks'
import './index.scss'

const PWAInstallPrompt = () => {
  const intl = useIntl()
  const { isVisible, isIOS, promptInstall, dismiss } = usePWAInstall()

  if (!isVisible) {
    return null
  }

  const portalElement = document.getElementById('portal')
  if (!portalElement) {
    return null
  }

  return ReactDOM.createPortal(
    <div className="pwa-install" role="dialog" aria-live="polite">
      <div className="pwa-install__content">
        <p className="pwa-install__title">
          {intl.formatMessage({ id: 'InstallApp' })}
        </p>
        <p className="pwa-install__desc">
          {intl.formatMessage({
            id: isIOS ? 'InstallAppIOSHint' : 'InstallAppHint',
          })}
        </p>
      </div>

      {!isIOS && (
        <button
          type="button"
          className="pwa-install__action"
          onClick={promptInstall}
        >
          <ImportSvg className="icon--stroke-white" />
          {intl.formatMessage({ id: 'Install' })}
        </button>
      )}

      <button
        type="button"
        className="pwa-install__close"
        aria-label={intl.formatMessage({ id: 'Cancel' })}
        onClick={dismiss}
      >
        <CrossSvg />
      </button>
    </div>,
    portalElement
  )
}

export default PWAInstallPrompt
