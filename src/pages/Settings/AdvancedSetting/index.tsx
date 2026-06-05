import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Navbar } from '@/components'
import { useAppDispatch } from '@/hooks'
import { configAction } from '@/store/config/config-slice'
import { getStorageConfig } from '@/utils'
import './index.scss'

const AdvancedSetting = () => {
  const [config, setConfig] = useState(getStorageConfig())
  const dispatch = useAppDispatch()
  const { formatMessage } = useIntl()

  const onHideBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setConfig({ ...config, hideBalance: isChecked })
    dispatch(configAction.setHideBalanceDefault(isChecked))
  }

  return (
    <div className="advanced-settings">
      <Navbar title="AdvancedSetting" enableBackButton={true} />

      <div className="flex-column gap-2">
        <span className="text--uppercase text--light text--3">
          {formatMessage({ id: 'DashboardInfo' })}
        </span>
        <ul className="advanced-settings__widget">
          <li className="flex-space-between flex-align-center">
            <span>{formatMessage({ id: 'HideBalanceOnStartup' })}</span>
            <input
              type="checkbox"
              onChange={onHideBalanceChange}
              checked={config.hideBalance}
            />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdvancedSetting
