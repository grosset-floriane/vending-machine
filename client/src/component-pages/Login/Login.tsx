import React, { useEffect } from "react"
import LoginForm from "../../components/LoginForm"
import Layout from "../../components/Layout/Layout"
import { Card, CardContent, Divider } from "@mui/material"
import RegistrationForm from "../../components/RegistrationForm"
import { useAppDispatch } from "../../store/store"
import { logout } from "../../store/slices/user"

const Login = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(logout())
    window.localStorage.clear()
  }, [])

  return (
    <Layout isAuthRoute={false}>
      <Card sx={{ maxWidth: 500, margin: "auto" }}>
        <CardContent>
          <LoginForm />
          <Divider
            sx={{
              borderColor: "rebeccapurple",
              mt: 6,
              mb: 6,
              borderBottomWidth: 2,
            }}
            variant="middle"
          />
          <RegistrationForm />
        </CardContent>
      </Card>
    </Layout>
  )
}

export default Login
