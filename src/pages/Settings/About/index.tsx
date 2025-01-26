import { useIntl } from 'react-intl'
import { Navbar } from '@/components'

const About = () => {
  const { formatMessage } = useIntl()

  return (
    <div className="about">
      <Navbar title="About" enableBackButton={true} />

      <div className="flex-column gap-2">
        <span className="text--light text--3">
          {formatMessage({ id: 'Contributors' })}
        </span>
        <span>troy213</span>
        <span>adrleo24</span>
      </div>
    </div>
  )
}

export default About
