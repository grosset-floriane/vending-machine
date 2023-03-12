import {
  configureStore,
  combineReducers,
  ThunkDispatch,
  AnyAction,
} from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import productsSlice from "./slices/products"
import userReducer from "./slices/user"
import toastMessageReducer from "./slices/toastMessage.slice"
import thunk from "redux-thunk"
import { customMiddleware } from "./customMiddleware"

const rootReducer = combineReducers({
  products: productsSlice,
  user: userReducer,
  toastMessage: toastMessageReducer,
})

export type RootState = ReturnType<typeof rootReducer>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>

const middlewares = [customMiddleware, thunk]

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
