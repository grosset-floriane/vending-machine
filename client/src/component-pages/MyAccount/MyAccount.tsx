import { Box, Button, Typography } from "@mui/material"
import React, { useState } from "react"
import Layout from "../../components/Layout"
import { useTypedSelector } from "../../store/typedSelector"
import { UserResponse } from "../../types/User"
import DeleteModal from "./DeleteModal"

const MyAccount = () => {
  const {
    username,
    role,
    id: userID,
  }: UserResponse = useTypedSelector((state) => state.user)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleDelete = () => {
    setIsModalOpen(true)
  }
  return (
    <Layout isAuthRoute>
      <Typography variant="h1">My account</Typography>
      <ul>
        <li>Username: {username}</li>
        <li>role: {role && role.toLowerCase()}</li>
      </ul>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={handleDelete} color="error">
          Delete account
        </Button>
        <Button variant="contained" component="a" href="/my-account/update">
          Edit my info
        </Button>
      </Box>
      <DeleteModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        userID={userID}
      />
    </Layout>
  )
}

export default MyAccount
