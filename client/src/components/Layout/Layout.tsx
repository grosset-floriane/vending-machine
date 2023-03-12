import React, { ReactElement, useEffect } from "react"
import Header from "../Header"
import { Container } from "@mui/material"
import { makeStyles } from "@mui/styles"
import ToastMessage from "../ToastMessage"
import { UserRole } from "../../types/User"
import { useTypedSelector } from "../../store/typedSelector"
import { useNavigate } from "react-router-dom"
import { BUYER, SELLER } from "../../utils/constants"

const useStyles = makeStyles(() => ({
  main: {
    margin: "80px auto 40px",
  },
}))

interface Props {
  isAuthRoute: boolean
  children: ReactElement | ReactElement[]
  restrictedRole?: UserRole
}

const Layout: React.FC<Props> = ({ children, isAuthRoute, restrictedRole }) => {
  const { role, id } = useTypedSelector((state) => state.user)
  const isUserAuth = Boolean(id)
  const classes = useStyles()
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedAppUser")
    if (!loggedUserJSON && isAuthRoute) {
      navigate("/")
    }
    if (role === SELLER && restrictedRole === SELLER) navigate("/products")
    if (role === BUYER && restrictedRole === BUYER) navigate("/products")
  }, [role, isAuthRoute, isUserAuth])
  return (
    <>
      <Header isAuthRoute={isAuthRoute} />
      <ToastMessage />
      <Container component="main" maxWidth="md" className={classes.main}>
        {children}
      </Container>
    </>
  )
}

export default Layout
