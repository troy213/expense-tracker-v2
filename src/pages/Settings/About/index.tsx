import { useIntl } from 'react-intl'
import { Navbar } from '@/components'

const About = () => {
  const { formatMessage } = useIntl()

  return (
    <div className="about">
      <Navbar title="About" enableBackButton={true} />

      <div className="flex-column gap-8">
        <div className="flex-column flex-align-center gap-2">
          <span className="text--bold">
            {formatMessage({ id: 'AboutThisApp' })}
          </span>
          <p className="text--align-center text--light text--3">
            {formatMessage({ id: 'AboutDescription' })}
          </p>
        </div>
        <div className="flex-column flex-align-center gap-2">
          <span className="text--bold">{formatMessage({ id: 'Design' })}</span>
          <span className="text--light text--3">troy213</span>
        </div>
        <div className="flex-column flex-align-center gap-2">
          <span className="text--bold">
            {formatMessage({ id: 'Contributors' })}
          </span>
          <span className="text--light text--3">troy213</span>
          <span className="text--light text--3">adrleo24</span>
        </div>
      </div>
    </div>
  )
}

export default About
