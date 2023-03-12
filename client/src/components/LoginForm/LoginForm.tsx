import React from "react"
import { useAppDispatch } from "../../store/store"
import { loginUser } from "../../store/slices/user"
import { Credentials, UserResponse } from "../../types/User"
import {
  Typography,
  FormLabel,
  Input,
  Button,
  Box,
  FormHelperText,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { setToken } from "../../services/api"
import { Controller, useForm } from "react-hook-form"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
  control: {
    display: "flex",
    flexDirection: "column",
  },
}))

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { errors, handleSubmit, control, clearErrors } = useForm()
  const classes = useStyles()

  const submit = (formValues: Credentials) => {
    const { username, password } = formValues
    dispatch(loginUser({ username, password }))
      .unwrap()
      .then((response: UserResponse) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { deposit, ...user } = response
        window.localStorage.setItem("loggedAppUser", JSON.stringify(user))
        setToken(response.token)
        navigate("/products")
      })
  }
  return (
    <>
      <Box mb={4}>
        <Typography variant="h2">Login</Typography>
      </Box>
      <form
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
        onSubmit={handleSubmit(submit)}
      >
        <Box className={classes.control}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Controller
            name="username"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            as={
              <Input
                name="username"
                id="username"
                onFocus={() => clearErrors()}
                error={Boolean(errors.username)}
              />
            }
          />
          {errors.username && (
            <FormHelperText error>Username is required</FormHelperText>
          )}
        </Box>
        <Box mb={2} className={classes.control}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            as={
              <Input
                type="password"
                name="password"
                id="password"
                error={Boolean(errors.password)}
                onFocus={() => clearErrors()}
              />
            }
          />
          {errors.password && (
            <FormHelperText error>Password is required</FormHelperText>
          )}
        </Box>

        <Button id="login-button" type="submit" variant="contained">
          Login
        </Button>
      </form>
    </>
  )
}

export default LoginForm
