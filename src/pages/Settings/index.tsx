import {
  CoinsSvg,
  ExportSvg,
  GlobeSvg,
  ImportSvg,
  PaletteSvg,
  TrashSvg,
} from '@/assets'
import { Navbar, Toolbar } from '@/components'

const Settings = () => {
  const appVersion = import.meta.env.APP_VERSION

  return (
    <div className='settings'>
      <div className='flex-column gap-8 p-4'>
        <Navbar title='Settings' enableBackButton={true} />

        <ul className='flex-column gap-8 py-4'>
          <li>
            <button type='button' className='btn btn-clear'>
              <div className='flex-align-center gap-2'>
                <CoinsSvg className='icon--stroke-primary' />
                <span>Category & Budget</span>
              </div>
            </button>
          </li>
          <li>
            <button type='button' className='btn btn-clear'>
              <div className='flex-align-center gap-2'>
                <ImportSvg className='icon--stroke-primary' />
                <span>Import Data (.xls)</span>
              </div>
            </button>
          </li>
          <li>
            <button type='button' className='btn btn-clear'>
              <div className='flex-align-center gap-2'>
                <ExportSvg className='icon--stroke-primary' />
                <span>Export Data (.xls)</span>
              </div>
            </button>
          </li>
          <li>
            <button type='button' className='btn btn-clear'>
              <div className='flex-align-center gap-2'>
                <PaletteSvg className='icon--stroke-primary' />
                <span>Theme</span>
              </div>
            </button>
          </li>
          <li>
            <button type='button' className='btn btn-clear'>
              <div className='flex-align-center gap-2'>
                <GlobeSvg className='icon--stroke-primary' />
                <span>Language</span>
              </div>
            </button>
          </li>
          <li className='mt-6'>
            <button type='button' className='btn btn-clear'>
              <div className='flex-align-center gap-2'>
                <TrashSvg className='icon--stroke-danger' />
                <span className='text--color-danger'>Delete Data</span>
              </div>
            </button>
          </li>
        </ul>
      </div>
      <div>
        <div className='flex-justify-center'>
          <span className='text--light text--3 py-4'>v{appVersion}</span>
        </div>
        <Toolbar />
      </div>
    </div>
  )
}

export default Settings
