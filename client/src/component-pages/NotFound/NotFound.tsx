import { Link, Typography } from "@mui/material"
import React from "react"
import Layout from "../../components/Layout"
import { useTypedSelector } from "../../store/typedSelector"

const NotFound = () => {
  const user = useTypedSelector((state) => state.user)
  const isAuth = Boolean(user?.id)
  return (
    <Layout isAuthRoute={false}>
      <Typography variant="h1">Not Found - 404</Typography>
      {isAuth ? (
        <Link href="/products">Products</Link>
      ) : (
        <Link href="/">Login or register</Link>
      )}
    </Layout>
  )
}

export default NotFound
