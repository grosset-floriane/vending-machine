import axios from "axios"
import { ProductInfo, BuyProductResponse } from "../types/Product"
import {
  UserResponse,
  UserRegistrationPayload,
  UserUpdatePayload,
  Credentials,
} from "../types/User"

axios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response.status === 401 && window.location.pathname !== "/") {
      window.localStorage.clear()
      window.location.href = "/"
    }
    error.message = error.response.data.error || error.message
    return Promise.reject(error)
  }
)

let token: string | null = null

export const setToken = (newToken: string) => {
  token = `bearer ${newToken}`
}

axios.interceptors.request.use((config) => {
  if (token) config.headers = { Authorization: token, ...config.headers }
  return config
})

export const login = async (
  credentials: Credentials
): Promise<UserResponse> => {
  return await axios.post("/login", credentials)
}

export const getProducts = () => {
  return axios.get("/products")
}

export const addProduct = ({
  productName,
  amountAvailable,
  cost,
}: ProductInfo) =>
  axios.post("/products", {
    productName,
    amountAvailable,
    cost,
  })

export const updateProduct = ({
  productName,
  amountAvailable,
  cost,
  productId,
}: ProductInfo) => {
  return axios.put(`/products/${productId}`, {
    productName,
    amountAvailable,
    cost,
  })
}

export const deleteProduct = ({ productId }: { productId: string }) =>
  axios.delete(`/products/${productId}`)

export const getUserInfo = ({
  userID,
}: {
  userID: string
}): Promise<UserResponse> => {
  return axios.get(`/users/${userID}`)
}

export const registerUser = ({
  username,
  password,
  role,
}: UserRegistrationPayload): Promise<UserResponse> =>
  axios.post("/users", { username, password, role })

export const updateUserInfo = ({
  username,
  password,
  id,
}: UserUpdatePayload): Promise<UserResponse> => {
  return axios.patch(`/users/${id}`, { username, password })
}

export const deleteUser = ({ userID }: { userID: string }) =>
  axios.delete(`/users/${userID}`)

export const buyProduct = ({
  productId,
  amount,
}: {
  productId: string
  amount: number
}): Promise<BuyProductResponse> => axios.post("/buy", { productId, amount })

export const depositCoin = ({ coin }: { coin: number }) => {
  return axios.post("/deposit", { coin })
}

export const resetDeposit = () => {
  return axios.post("/reset")
}
