import React, { useState, FormEvent } from "react"
import { Button, FormControl, TextField, Typography, Box } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useAppDispatch } from "../../store/store"
import { addProduct } from "../../store/slices/products"
import Layout from "../../components/Layout"
import { setMessage } from "../../store/slices/toastMessage.slice"
import { BUYER } from "../../utils/constants"

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

const AddProduct: React.FC = () => {
  const [productName, setProductName] = useState("")
  const [amountAvailable, setAmountAvailable] = useState(0)
  const [cost, setCost] = useState(0)
  const classes = useStyles()
  const dispatch = useAppDispatch()

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(addProduct({ productName, cost, amountAvailable }))
      .unwrap()
      .then(() => {
        dispatch(setMessage({ message: "Product successfully added!" }))
        setProductName("")
        setAmountAvailable(1)
        setCost(0)
      })
  }

  return (
    <Layout isAuthRoute restrictedRole={BUYER}>
      <Typography variant="h1">Add a new product</Typography>
      <form noValidate onSubmit={submit}>
        <FormControl fullWidth sx={{ mb: 2, mt: 3 }}>
          <TextField
            label="Product name"
            type="text"
            id="productName"
            fullWidth
            required
            name="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Amout available"
            type="number"
            id="amountAvailable"
            fullWidth
            required
            name="amountAvailable"
            inputProps={{ min: 0 }}
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
            required
            name="cost"
            inputProps={{ min: 0, step: 5 }}
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </FormControl>
        <Box className={classes.buttonContainer}>
          <Button type="submit" variant="outlined">
            Add product
          </Button>
        </Box>
      </form>
    </Layout>
  )
}

export default AddProduct
