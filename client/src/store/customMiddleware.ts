import { Dispatch } from "redux"
import { RootState } from "./store"
import {
  ActionsFromAsyncThunk as Action,
  AnyAsyncThunk as T,
} from "@reduxjs/toolkit/dist/matchers"
import { redirect } from "react-router-dom"
import { setMessage } from "./slices/toastMessage.slice"
import {
  addToDeposit,
  getUser,
  loginUser,
  logout,
  registerUser,
  resetDeposit,
} from "./slices/user"
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "./slices/products"
import { setToken } from "../services/api"

export const customMiddleware = ({
  dispatch,
}: {
  dispatch: Dispatch
  getState: () => RootState
}) => {
  return (next: (action: Action<T>) => void) => {
    return (action: Action<T>) => {
      /* eslint-disable indent */
      switch (action.type) {
        case "user/login/fulfilled":
          dispatch(setMessage({ message: "You're now logged in, welcome!" }))
          next(action)
          break

        case getUser.rejected.type:
          dispatch(
            setMessage({
              message:
                action.error.message ||
                "An error occured, please try again later",
              severity: "error",
            })
          )
          setToken("")
          window.localStorage.clear()
          dispatch(logout)
          redirect("/")
          break

        case deleteProduct.rejected.type:
        case updateProduct.rejected.type:
        case addProduct.rejected.type:
        case getAllProducts.rejected.type:
        case resetDeposit.rejected.type:
        case addToDeposit.rejected.type:
        case loginUser.rejected.type:
        case registerUser.rejected.type:
          dispatch(
            setMessage({
              message:
                action.error.message ||
                "An error occured, please try again later",
              severity: "error",
            })
          )
          next(action)
          break
        default:
          next(action)
          break
      }
    }
  }
}
