import React, { useState, FormEvent } from "react"
import { Button, FormControl, TextField, Typography, Box } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useAppDispatch } from "../../store/store"
import {
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "../../store/slices/products"
import { setMessage } from "../../store/slices/toastMessage.slice"
import { useNavigate } from "react-router-dom"

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
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
}))

interface Props {
  savedAmount: number
  savedCost: number
  savedName: string
  productId: string
}

const EditProduct: React.FC<Props> = ({
  savedAmount,
  savedCost,
  savedName,
  productId,
}) => {
  const [amountAvailable, setAmountAvailable] = useState(savedAmount)
  const [productName, setProductName] = useState(savedName)
  const [cost, setCost] = useState(savedCost)
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(updateProduct({ productId, productName, cost, amountAvailable }))
      .unwrap()
      .then(() => {
        dispatch(setMessage({ message: "Product successfully updated!" }))
        dispatch(getAllProducts())
      })
  }

  const handleDelete = () => {
    dispatch(deleteProduct(productId))
      .unwrap()
      .then(() => {
        dispatch(setMessage({ message: "Product successfully deleted!" }))
        navigate("/products")
      })
  }

  return (
    <>
      <Typography component="h2" variant="h4">
        Edit product:
      </Typography>
      <form noValidate onSubmit={submit}>
        <FormControl fullWidth sx={{ mb: 2, mt: 3 }}>
          <TextField
            label="Product name"
            type="text"
            id="productName"
            fullWidth
            className={classes.input}
            required
            name="productName"
            sx={{ color: "white" }}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Amount"
            type="number"
            id="availableAmount"
            fullWidth
            className={classes.input}
            required
            name="availableAmount"
            inputProps={{ min: 0 }}
            sx={{ color: "white" }}
            value={amountAvailable}
            onChange={(e) => setAmountAvailable(Number(e.target.value))}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Unit price"
            type="number"
            id="cost"
            fullWidth
            className={classes.input}
            required
            name="cost"
            inputProps={{ min: 0, step: 5 }}
            sx={{ color: "white" }}
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </FormControl>
        <Box className={classes.buttonContainer}>
          <Button
            type="button"
            variant="contained"
            sx={{ bgColor: "#fff", color: "#fff" }}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button
            type="submit"
            variant="outlined"
            sx={{ borderColor: "#fff", color: "#fff" }}
          >
            Update product
          </Button>
        </Box>
      </form>
    </>
  )
}

export default EditProduct
