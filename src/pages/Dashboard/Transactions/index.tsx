import TransactionDetail from './TransactionDetail'

const Transactions = () => {
  return (
    <div className='transactions flex-column gap-4'>
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
      <TransactionDetail />
    </div>
  )
}

// No Transactions UI

// const Transactions = () => {
//   return (
//     <div className='transactions flex-column gap-4'>
//       <div className='flex-justify-center flex-align-center h-100'>
//         <span className='text--italic text--light'>
//           There is no transaction
//         </span>
//       </div>
//     </div>
//   )
// }

export default Transactions
