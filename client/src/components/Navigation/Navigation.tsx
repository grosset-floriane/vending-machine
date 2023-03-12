import React from "react"
import { makeStyles } from "@mui/styles"
import { useLocation } from "react-router-dom"
import NavItem from "./NavItem"
import { useTypedSelector } from "../../store/typedSelector"
import { UserResponse } from "../../types/User"
import { BOTH, BUYER, SELLER } from "../../utils/constants"

const useStyles = makeStyles(() => ({
  nav: {
    marginLeft: "auto",
    marginRight: 16,
  },
  list: {
    margin: 0,
    padding: 0,
    display: "flex",
    gap: 8,
  },
  listItem: {
    listStyle: "none",
  },
  link: {
    color: "white",
    fontFamily: "Roboto",
  },
  active: {
    textDecoration: "underline",
    "&:hover": {
      textDecoration: "none",
    },
  },
}))

const NAV_LINKS = [
  { path: "/products", label: "Products", userRole: BOTH },
  { path: "/my-account", label: "My account", userRole: BOTH },
  { path: "/my-deposit", label: "Deposit", userRole: BUYER },
  {
    path: "/products/add-product",
    label: "Add new product",
    userRole: SELLER,
  },
]

const Navigation = () => {
  const classes = useStyles()
  const { pathname } = useLocation()
  const { role }: UserResponse = useTypedSelector((state) => state.user)

  return (
    <nav className={classes.nav}>
      <ul className={classes.list}>
        {NAV_LINKS.map(
          ({ label, path, userRole }) =>
            (role === userRole || userRole === "BOTH") && (
              <NavItem
                key={path}
                label={label}
                path={path}
                isActive={pathname === path}
              />
            )
        )}
      </ul>
    </nav>
  )
}

export default Navigation
