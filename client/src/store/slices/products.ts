import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import {
  getProducts,
  updateProduct as apiUpdateProduct,
  addProduct as apiAddProduct,
  deleteProduct as apiDeleteProduct,
} from "../../services/api"
import { Product, ProductInfo } from "../../types/Product"

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async () => {
    return getProducts()
  }
)

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, productName, cost, amountAvailable }: ProductInfo) => {
    return apiUpdateProduct({ productId, productName, cost, amountAvailable })
  }
)

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async ({ productName, cost, amountAvailable }: ProductInfo) => {
    return apiAddProduct({ productName, cost, amountAvailable })
  }
)

// export const addNewBlog = createAsyncThunk(
//   "blogs/addNewBlog",
//   async (newBlog) => {
//     return addBlog(newBlog)
//   }
// )

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId: string) => {
    return apiDeleteProduct({ productId })
  }
)

// export const voteForBlog = createAsyncThunk(
//   "blogs/voteForBlog",
//   async (newBlog) => {
//     return updateBlog(newBlog)
//   }
// )

// export const addComment = createAsyncThunk(
//   "blogs/addComment",
//   async (newComment) => {
//     return addNewComment(newComment)
//   }
// )

const initialState = {
  products: [],
  isLoading: true,
}

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: {
    [getAllProducts.fulfilled.type]: (state, action) => ({
      ...state,
      products: action.payload,
      isLoading: false,
    }),
    [updateProduct.fulfilled.type]: (state, action) => ({
      ...state,
      products: state?.products?.map((p: Product) =>
        p.id === action.meta.arg.productId ? action.payload : p
      ),
      isLoading: false,
    }),
    [addProduct.fulfilled.type]: (state, action) => ({
      ...state,
      products: state?.products?.concat(action.payload),
      isLoading: false,
    }),
    [deleteProduct.fulfilled.type]: (state, action) => ({
      ...state,
      products: state?.products?.filter(
        (p: Product) => p.id !== action.meta.arg
      ),
      isLoading: false,
    }),

    // [addNewBlog.fulfilled.type]: (state, action) => ({
    //   ...state,
    //   blogs: [...state.blogs, action.payload],
    // }),
    // [removeBlog.fulfilled.type]: (state, action) => ({
    //   ...state,
    //   blogs: state.blogs.filter((blog) => blog.id !== action.meta.arg.id),
    // }),
    // [voteForBlog.fulfilled.type]: (state, action) => ({
    //   ...state,
    //   blogs: state.blogs
    //     .map((blog) => (blog.id === action.meta.arg.id ? action.payload : blog))
    //     .sort((a, b) => b.likes - a.likes),
    // }),
    // [addComment.fulfilled.type]: (state) => ({
    //   ...state,
    // }),
  },
})

export default productsSlice.reducer
