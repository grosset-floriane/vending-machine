import { AlertColor } from "@mui/material"
import { createSlice } from "@reduxjs/toolkit"

interface InitialState {
  message: string | null
  isVisible: boolean
  severity?: AlertColor
}

const initialState: InitialState = {
  message: "hello",
  isVisible: false,
  severity: undefined,
}

export const toastMessageSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    closeMessage: () => initialState,
    setMessage: (state, action) => ({ ...action.payload, isVisible: true }),
  },
})

export const { closeMessage, setMessage } = toastMessageSlice.actions

export default toastMessageSlice.reducer
