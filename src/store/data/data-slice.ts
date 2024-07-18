import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Data, SetStatePayload } from '@/types'

type InitialState = {
  data: Data[]
}

const initialState: InitialState = {
  data: [],
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Data[]>) {
      state.data = action.payload
    },
    setState(
      state: InitialState,
      action: PayloadAction<SetStatePayload<InitialState>>
    ) {
      state[action.payload.state] = action.payload.value
    },
    resetState() {
      return initialState
    },
  },
})

export const dataAction = dataSlice.actions

export default dataSlice
