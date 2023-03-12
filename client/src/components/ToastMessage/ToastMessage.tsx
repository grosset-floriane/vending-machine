import React from "react"
import { useTypedSelector } from "../../store/typedSelector"
import { Dialog, Alert, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"
import { closeMessage } from "../../store/slices/toastMessage.slice"
import { useAppDispatch } from "../../store/store"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
  alert: {
    "& .MuiAlert-action": {
      paddingTop: 0,
    },
  },
  closeButton: {
    fontSize: 14,
  },
}))

const ToastMessage = () => {
  const { message, isVisible, severity } = useTypedSelector(
    (state) => state.toastMessage
  )
  const dispatch = useAppDispatch()
  const classes = useStyles()

  if (!isVisible) return null

  return (
    <Dialog
      open={isVisible}
      disableEnforceFocus
      disablePortal
      disableScrollLock
      hideBackdrop
      sx={{ top: "initial", left: "initial" }}
    >
      <Alert
        severity={severity}
        className={classes.alert}
        action={
          <IconButton
            onClick={() => dispatch(closeMessage())}
            aria-label="Close message"
            className={classes.closeButton}
          >
            <Close color={severity || "success"} fontSize="small" />
          </IconButton>
        }
      >
        {message}{" "}
      </Alert>
    </Dialog>
  )
}

export default ToastMessage
