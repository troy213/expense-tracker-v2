import { useIntl } from 'react-intl'
import { Navbar } from '@/components'
import { getStorageConfig, setStorage } from '@/utils'
import { useState } from 'react'

const AdvancedSetting = () => {
  const [config, setConfig] = useState(getStorageConfig())
  const { formatMessage } = useIntl()

  const onHideBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    const existingConfig = config
    const updatedConfig = {
      ...existingConfig,
      hideBalance: isChecked,
    }
    setConfig(updatedConfig)
    setStorage('config', JSON.stringify(updatedConfig))
  }

  return (
    <div className="advanced-setting">
      <Navbar title="AdvancedSetting" enableBackButton={true} />

      <div className="flex-space-between">
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
