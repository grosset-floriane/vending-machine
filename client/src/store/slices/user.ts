import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  login,
  registerUser as apiRegisterUser,
  depositCoin,
  resetDeposit as apiResetDeposit,
  getUserInfo,
  updateUserInfo,
} from "../../services/api"
import {
  UserResponse,
  UserRegistrationPayload,
  UserUpdatePayload,
  Credentials,
} from "../../types/User"

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: Credentials): Promise<UserResponse> => login(credentials)
)

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (credentials: UserRegistrationPayload): Promise<UserResponse> => {
    return apiRegisterUser(credentials)
  }
)

export const addToDeposit = createAsyncThunk(
  "user/addToDeposit",
  async (coin: number) => {
    return depositCoin({ coin })
  }
)
export const resetDeposit = createAsyncThunk("user/resetDeposit", async () => {
  return apiResetDeposit()
})

export const getUser = createAsyncThunk(
  "user/getUser",
  async (userID: string): Promise<UserResponse> => {
    return getUserInfo({ userID })
  }
)
export const updateUser = createAsyncThunk(
  "user/getUser",
  async ({
    username,
    password,
    id,
  }: UserUpdatePayload): Promise<UserResponse> => {
    return updateUserInfo({ username, password, id })
  }
)

const initialState = {
  username: null,
  role: null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: () => initialState,
    setUser: (state, action) => ({ ...action.payload }),
  },
  extraReducers: {
    [loginUser.fulfilled.type]: (state, action) => ({
      ...action.payload,
    }),
    [addToDeposit.fulfilled.type]: (state, action) => ({
      ...state,
      deposit: action.payload.deposit,
    }),
    [resetDeposit.fulfilled.type]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [getUser.fulfilled.type]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [updateUser.fulfilled.type]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
})

export const { logout, setUser } = userSlice.actions

export default userSlice.reducer
