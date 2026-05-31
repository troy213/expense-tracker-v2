import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Navbar } from '@/components'
import { useAppDispatch } from '@/hooks'
import { configAction } from '@/store/config/config-slice'
import { getStorageConfig } from '@/utils'

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
    <div className="advanced-setting">
      <Navbar title="AdvancedSetting" enableBackButton={true} />

      <div className="flex-space-between flex-align-center">
        <span>{formatMessage({ id: 'HideBalanceOnStartup' })}</span>
        <input
          type="checkbox"
          onChange={onHideBalanceChange}
          checked={config.hideBalance}
        />
      </div>
    </div>
  )
}

export default AdvancedSetting
