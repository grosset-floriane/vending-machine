import { Dialog, DialogActions, Button, Typography, Box } from "@mui/material"
import React from "react"
import { deleteUser } from "../../services/api"
import { setMessage } from "../../store/slices/toastMessage.slice"
import { useAppDispatch } from "../../store/store"
import { logout } from "../../store/slices/user"
import { useNavigate } from "react-router-dom"

interface Props {
  isOpen: boolean
  handleClose: () => void
  userID: string
}

const DeleteModal: React.FC<Props> = ({ isOpen, handleClose, userID }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDelete = () => {
    deleteUser({ userID })
      .then(() => {
        window.localStorage.clear()
        dispatch(logout())
        navigate("/")
        dispatch(
          setMessage({ message: "Your account has been successfully deleted!" })
        )
      })
      .catch((err) =>
        dispatch(
          setMessage({
            message:
              err.message || "An error occured while deleting your account.",
            severity: "error",
          })
        )
      )
  }
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box pt={2} pb={2} pl={2} pr={2}>
        <Typography variant="h5" component="h2">
          Are you sure to delete your account?
        </Typography>
        <Typography>
          This action is definitive and all your data will be erased.
        </Typography>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete my account
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default DeleteModal
