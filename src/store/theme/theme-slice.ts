import { createSlice, PayloadAction } from "@reduxjs/toolkit"
// import { Category, SetStatePayload } from "@/types"

type InitialState = {
  theme: 'light' | 'dark'
};

const initialState: InitialState = {
  theme: "light"
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state){
        state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setState(
      state: InitialState,
      action: PayloadAction<'light' | 'dark'>
    ) {
      state.theme = action.payload
    },
    resetState() {
      return initialState
    },
  },
});

export const themeAction = themeSlice.actions

export default themeSlice
