export interface ProductInfo {
  productName: string
  amountAvailable: number
  cost: number
  productId?: string
}

export interface Product {
  productName: string
  amountAvailable: number
  cost: number
  id: string
}

export interface BuyProductResponse {
  change: number[]
  products: {
    amount: number
    productName: string
  }
  totalPaid: number
}
