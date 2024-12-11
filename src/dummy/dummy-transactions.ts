import { Data } from '@/types'

export const dummyTransactions: Data[] = [
  {
    id: 'f9dc2457-0c4c-4481-bca0-5c07166beede',
    date: '2024-10-26T11:33:20.823Z',
    subdata: [
      {
        id: '12d8c759-c5b2-4363-94e9-4185ebece235',
        type: 'income',
        category: 'Salary',
        item: [
          {
            description: 'Salary Oct 2024',
            amount: 5_000_000,
          },
        ],
      },
      {
        id: '5b15e8e5-e2dd-4ede-8528-e4f5ea1d31df',
        type: 'expense',
        category: 'Food & Beverages',
        item: [
          {
            description: 'Pizza Hut',
            amount: 100_000,
          },
        ],
      },
      {
        id: '9f27ed33-d0e9-464e-aa92-5370888d1d72',
        type: 'expense',
        category: 'Shopping',
        item: [
          {
            description: 'Soap',
            amount: 15_000,
          },
          {
            description: 'Oil',
            amount: 30_000,
          },
          {
            description: 'Shampoo',
            amount: 20_000,
          },
          {
            description: 'Milk',
            amount: 21_000,
          },
        ],
      },
    ],
  },
  {
    id: '1103dfed-1add-4f4a-91d3-b9c17472e615',
    date: '2024-10-25T11:33:20.823Z',
    subdata: [
      {
        id: '14aca51e-200b-400f-a5f9-83e95f37b915',
        type: 'expense',
        category: 'Transportation',
        item: [
          {
            description: 'Gas',
            amount: 100_000,
          },
        ],
      },
      {
        id: '88d2bf4a-1827-4e71-ad62-429ab037aa87',
        type: 'expense',
        category: 'Food & Beverages',
        item: [
          {
            description: 'Gado-gado',
            amount: 15_000,
          },
        ],
      },
    ],
  },
  {
    id: 'e91082e5-b1db-43ae-bf14-e926294c0116',
    date: '2024-10-24T11:33:20.823Z',
    subdata: [
      {
        id: '1038a8e6-e6bb-4c86-ba4e-a03f15552149',
        type: 'expense',
        category: 'Others',
        item: [
          {
            description: 'Parking',
            amount: 2_000,
          },
        ],
      },
    ],
  },
]
