import React from "react"
import { AppBar, Button } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../store/store"
import { logout } from "../../store/slices/user"
import Navigation from "../Navigation"

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    // "&."
  },
  username: {
    marginLeft: "auto",
    paddingRight: 8,
  },
  siteTitle: {
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
    marginRight: "auto",
  },
}))

interface Props {
  isAuthRoute: boolean
}

const Header: React.FC<Props> = ({ isAuthRoute }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(logout())
    navigate("/")
  }
  return (
    <AppBar className={classes.container} sx={{ flexDirection: "row" }}>
      <Link to={isAuthRoute ? "/products" : "/"} className={classes.siteTitle}>
        The Silver Nibbler
      </Link>
      {isAuthRoute && (
        <>
          <Navigation />
          <Button onClick={handleLogout} variant="contained" color="secondary">
            Log out
          </Button>
        </>
      )}
    </AppBar>
  )
}

export default Header
