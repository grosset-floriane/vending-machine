import React, { useState, FormEvent } from "react"
import {
  Typography,
  FormControl,
  FormHelperText,
  Button,
  TextField,
  Box,
  Link,
} from "@mui/material"

import { makeStyles } from "@mui/styles"
import { Product } from "../../types/Product"
import { buyProduct } from "../../services/api"
import { setMessage } from "../../store/slices/toastMessage.slice"
import { useAppDispatch } from "../../store/store"
import { getUser } from "../../store/slices/user"
import { useTypedSelector } from "../../store/typedSelector"
import { getAllProducts } from "../../store/slices/products"

const useStyles = makeStyles(() => ({
  form: {
    marginTop: 24,
  },
  input: {
    "& .MuiFormLabel-root, & .MuiInputBase-input": {
      color: "#fff",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#fff",
    },
  },
}))

const BuyForm: React.FC<Product> = ({
  productName,
  cost,
  amountAvailable,
  id,
}) => {
  const classes = useStyles()
  const [amount, setAmount] = useState(1)
  const [error, setError] = useState("")
  const dispatch = useAppDispatch()
  const { id: userID, deposit } = useTypedSelector((state) => state.user)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (amount * cost > deposit) {
      return setError("You don't have enough in your deposit")
    }
    buyProduct({ productId: id, amount })
      .then(
        ({
          change,
          products: { amount: amountBought, productName: productBought },
          totalPaid,
        }) => {
          dispatch(
            setMessage({
              message: `You paid ¢${totalPaid} for ${amountBought} ${productBought}. ${
                change.length > 0
                  ? `Your change is ${change.map((c) => `¢${c}`).join(", ")}`
                  : ""
              }
              `,
            })
          )
          dispatch(getUser(userID))
          dispatch(getAllProducts())
        }
      )
      .catch((err) =>
        dispatch(
          setMessage({
            message: err.message || "An error occured, please try again later",
            severity: "error",
          })
        )
      )
  }

  return (
    <>
      <Typography component="h2" variant="h4">
        Buy {productName}:
      </Typography>
      {amountAvailable ? (
        <form noValidate className={classes.form} onSubmit={submit}>
          <FormControl fullWidth>
            <TextField
              label="Amount"
              type="number"
              id="amount"
              fullWidth
              className={classes.input}
              required
              name="amount"
              inputProps={{ min: 0, max: amountAvailable }}
              sx={{ color: "white" }}
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value))
                setError("")
              }}
            />
          </FormControl>
          <FormHelperText
            sx={{
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              Current deposit: {deposit} &cent;{" "}
              <Link
                href="/my-deposit"
                sx={{ color: "#fff", textDecoration: "underline" }}
              >
                Add to deposit
              </Link>
            </span>
            <span>Total: {cost && amount * cost} &cent;</span>
          </FormHelperText>
          {error && (
            <FormHelperText
              sx={{
                color: "#fff",
                border: "1px solid #fff",
                borderRadius: 2,
                padding: 1,
                marginTop: 2,
              }}
            >
              {error}
            </FormHelperText>
          )}

          <Box mt={2}>
            <Button
              type="submit"
              variant="outlined"
              sx={{ borderColor: "#fff", color: "#fff" }}
            >
              Buy now
            </Button>
          </Box>
        </form>
      ) : (
        <Typography>This product is not available at the moment.</Typography>
      )}
    </>
  )
}

export default BuyForm
