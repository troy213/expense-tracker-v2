import { MoreVerticalSvg } from '@/assets'
import { Navbar, Toolbar } from '@/components'
import ReportInfo from './ReportInfo'
import ReportWidget from './ReportWidget'

interface ThemeProps {
  theme: string;
}

const Reports: React.FC<ThemeProps> = ({theme}) => {
  return (
    <div className={`reports ${theme === 'dark'? 'dark' : ''}`}>
      <div className='flex-column gap-4 p-4'>
        <Navbar enableBackButton={true} title='Reports'>
          <button type='button' className='btn btn-clear'>
            <MoreVerticalSvg className='icon--stroke-primary' />
          </button>
        </Navbar>

        <ReportInfo />

        <ReportWidget type='income' />
        <ReportWidget type='outcome' />
      </div>
      <Toolbar />
    </div>
  )
}

export default Reports
