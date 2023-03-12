import React, { useState, FormEvent, useEffect } from "react"
import Layout from "../../components/Layout"
import { useTypedSelector } from "../../store/typedSelector"
import { useAppDispatch } from "../../store/store"
import { updateUser } from "../../store/slices/user"
import {
  Typography,
  FormLabel,
  Input,
  Button,
  FormControl,
} from "@mui/material"
import { setMessage } from "../../store/slices/toastMessage.slice"

const EditAccount = () => {
  const { username: usernameDefault, id } = useTypedSelector(
    (state) => state.user
  )
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useAppDispatch()

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(updateUser({ id, username, password }))
      .unwrap()
      .then((response) => {
        dispatch(setMessage({ message: "Your info has been updated!" }))
        setPassword("")
        setUsername(response.username)
      })
  }

  useEffect(() => {
    setUsername(usernameDefault)
  }, [usernameDefault])

  return (
    <Layout isAuthRoute>
      <Typography variant="h1">Update my info</Typography>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 32,
        }}
        onSubmit={submit}
        noValidate
      >
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            type="text"
            name="username"
            id="username"
            required
            onChange={({ target }) => setUsername(target.value)}
            value={username}
          />
        </FormControl>
        <FormControl sx={{ mb: 2 }}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            type="password"
            name="password"
            required
            id="password"
            onChange={({ target }) => setPassword(target.value)}
            value={password}
          />
        </FormControl>

        <Button id="login-button" type="submit" variant="contained">
          Update my details
        </Button>
      </form>
    </Layout>
  )
}

export default EditAccount
