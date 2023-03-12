import React from "react"
import { Link } from "react-router-dom"
import { Link as MuiLink } from "@mui/material"
import { makeStyles } from "@mui/styles"
const useStyles = makeStyles(() => ({
  listItem: {
    listStyle: "none",
  },
  active: {
    color: "#663399 !important",
    backgroundColor: "#fff",
  },
}))

interface Props {
  label: string
  path: string
  isActive: boolean
}

const NavItem: React.FC<Props> = ({ label, path, isActive }) => {
  const classes = useStyles()

  return (
    <li className={classes.listItem}>
      <MuiLink
        component={Link}
        to={path}
        className={isActive ? classes.active : ""}
        color="#fff"
      >
        {label}
      </MuiLink>
    </li>
  )
}

export default NavItem
