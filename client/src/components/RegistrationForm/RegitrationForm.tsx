import React from "react"
import { useAppDispatch } from "../../store/store"
import { registerUser } from "../../store/slices/user"
import {
  Typography,
  FormLabel,
  Input,
  Button,
  FormControl,
  FormHelperText,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material"
import { setMessage } from "../../store/slices/toastMessage.slice"
import { UserRegistrationPayload } from "../../types/User"
import { Controller, useForm } from "react-hook-form"
import { BUYER, SELLER } from "../../utils/constants"

const RegistrationForm: React.FC = () => {
  const dispatch = useAppDispatch()
  const { control, errors, clearErrors, handleSubmit } = useForm()

  const submit = (formValues: UserRegistrationPayload) => {
    const { username, password, role } = formValues
    dispatch(registerUser({ username, password, role }))
      .unwrap()
      .then(() => {
        dispatch(
          setMessage({
            message:
              "User successfully created! You can now login to your account.",
          })
        )
      })
  }
  return (
    <>
      <Box mb={4}>
        <Typography variant="h2">Register</Typography>
      </Box>
      <form
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
        onSubmit={handleSubmit(submit)}
      >
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Controller
            name="username"
            control={control}
            rules={{ required: true, minLength: 3 }}
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
            <FormHelperText error>
              {errors.username.type === "required"
                ? "Username is required"
                : "Username must be minimum 3 characters"}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Controller
            name="password"
            control={control}
            rules={{ required: true, minLength: 3 }}
            defaultValue=""
            as={
              <Input
                type="password"
                name="password"
                id="password"
                onFocus={() => clearErrors()}
                error={Boolean(errors.password)}
              />
            }
          />
          {errors.password && (
            <FormHelperText error>
              {errors.password.type === "required"
                ? " Password is required"
                : "Password must be minimum 3 characters"}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <FormLabel id="role-label">User role</FormLabel>
          <Controller
            name="role"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            as={
              <RadioGroup
                aria-labelledby="role-label"
                defaultValue={BUYER}
                name="role"
              >
                <FormControlLabel
                  value={BUYER}
                  sx={{ color: errors.role ? "#d32f2f" : "inherit" }}
                  control={
                    <Radio
                      sx={{ color: errors.role ? "#d32f2f" : "inherit" }}
                    />
                  }
                  label="Buyer"
                  onFocus={() => clearErrors()}
                />
                <FormControlLabel
                  value={SELLER}
                  sx={{ color: errors.role ? "#d32f2f" : "inherit" }}
                  control={
                    <Radio
                      sx={{ color: errors.role ? "#d32f2f" : "inherit" }}
                    />
                  }
                  label="Seller"
                  onFocus={() => clearErrors()}
                />
              </RadioGroup>
            }
          />
          {errors.role && (
            <FormHelperText error>Role is required</FormHelperText>
          )}
        </FormControl>

        <Button id="login-button" type="submit" variant="contained">
          Register
        </Button>
      </form>
    </>
  )
}

export default RegistrationForm
