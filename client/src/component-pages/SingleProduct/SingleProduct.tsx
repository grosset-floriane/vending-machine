import { Typography, Grid, Card, CardContent } from "@mui/material"
import React, { useEffect } from "react"
import Layout from "../../components/Layout"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useTypedSelector } from "../../store/typedSelector"
import { Product } from "../../types/Product"
import BuyForm from "./BuyForm"
import EditProduct from "./EditProduct"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { getAllProducts } from "../../store/slices/products"
import { useAppDispatch } from "../../store/store"
import { BUYER, SELLER } from "../../utils/constants"

const SingleProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useTypedSelector((state) => state.products)
  const { role, id: userID } = useTypedSelector((state) => state.user)
  const product = products.find((p: Product) => p?.id === id)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getAllProducts())
  }, [])

  useEffect(() => {
    if (products.length > 0 && !product) {
      navigate("/products")
    }
  }, [products, product])

  if (product) {
    const {
      productName,
      amountAvailable,
      cost,
      id: productId,
      sellerId,
    } = product
    const isBuyer = role === BUYER
    const isSellerOwner = role === SELLER && sellerId === userID

    return (
      <Layout isAuthRoute>
        <Link
          to="/products"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 0",
            gap: 8,
          }}
        >
          <ArrowBackIcon fontSize="small" />
          Back to all products
        </Link>
        <Typography variant="h1">{productName}</Typography>
        <Grid container mt={4}>
          <Grid item xs={12} md={7}>
            <Typography>Number in stock: {amountAvailable}</Typography>
            <Typography>Unit price: {cost} &cent;</Typography>
          </Grid>
          {(isSellerOwner || isBuyer) && (
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  bgcolor: "rebeccapurple",
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  {isBuyer && (
                    <BuyForm
                      productName={productName}
                      cost={cost}
                      amountAvailable={amountAvailable}
                      id={productId}
                    />
                  )}
                  {isSellerOwner && (
                    <EditProduct
                      savedAmount={amountAvailable}
                      savedCost={cost}
                      savedName={productName}
                      productId={productId}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Layout>
    )
  }
  return null
}

export default SingleProduct
