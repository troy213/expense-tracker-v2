const ReportInfo = () => {
  return (
    <div className='report-info'>
      <span className='text--light text--3'>1 Apr 2024 - 30 Apr 2024</span>
      <div className='flex-space-between'>
        <span>Total Income</span>
        <span>Rp10.000.000</span>
      </div>
      <div className='flex-space-between'>
        <span>Total Outcome</span>
        <span>Rp1.234.567</span>
      </div>
      <div className='flex-space-between'>
        <span>Total Difference</span>
        <span>Rp1.234.567</span>
      </div>
      <div className='flex-space-between'>
        <span>Avg. Spending</span>
        <span>Rp1.234.567/day</span>
      </div>
    </div>
  )
}

export default ReportInfo
