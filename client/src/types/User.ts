export type UserRole = "BUYER" | "SELLER"

export interface Credentials {
  username: string
  password: string
}

export interface UserRegistrationPayload extends Credentials {
  role: UserRole
}

export interface UserUpdatePayload extends Credentials {
  id: string
}

export interface UserResponse {
  token: string
  id: string
  deposit: number
  role: UserRole
  username: string
}
