import { Typography } from "@mui/material"
import React from "react"
import Layout from "../../components/Layout"
import ProductsList from "../../components/ProductsList"

const Products: React.FC = () => {
  return (
    <Layout isAuthRoute>
      <Typography variant="h1">Products</Typography>
      <ProductsList />
    </Layout>
  )
}

export default Products
