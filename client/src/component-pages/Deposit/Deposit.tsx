import React from "react"
import { Button, IconButton, Typography, Box } from "@mui/material"
import Layout from "../../components/Layout"
import { makeStyles } from "@mui/styles"
import { useTypedSelector } from "../../store/typedSelector"
import { useAppDispatch } from "../../store/store"
import { addToDeposit, resetDeposit } from "../../store/slices/user"
import { setMessage } from "../../store/slices/toastMessage.slice"
import { SELLER } from "../../utils/constants"

const useStyles = makeStyles(() => ({
  coin: {
    "&.MuiButtonBase-root": {
      width: 70,
      height: 70,
      backgroundColor: "rebeccapurple",
      color: "#fff",
      margin: 8,
      border: "4px solid #52297a",
      "&:hover": {
        backgroundColor: "#7f40bf",
      },
    },
  },
  coinsWrapper: {
    margin: "16px auto",
    width: "fit-content",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
  },
}))

const COINS_VALUES = [5, 10, 20, 50, 100]

const Deposit = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const { deposit } = useTypedSelector((state) => state.user)

  const handleAddToDeposit = (c: number) => {
    dispatch(addToDeposit(c))
      .unwrap()
      .then(() => dispatch(setMessage({ message: `${c} ¢ added!` })))
  }

  const handleResetDeposit = () => {
    dispatch(resetDeposit())
      .unwrap()
      .then(() => dispatch(setMessage({ message: "Reset successfull" })))
  }

  return (
    <Layout isAuthRoute restrictedRole={SELLER}>
      <Typography variant="h1">My deposit</Typography>
      <Box mb={5} mt={4} component="section">
        <Typography variant="h2">Current deposit</Typography>
        <Typography
          variant="h1"
          component="p"
          align="center"
          fontWeight={500}
          color="primary"
        >
          {deposit} &cent;
        </Typography>
      </Box>
      <Box component="section">
        <Typography variant="h2">Add coin to deposit</Typography>

        <Box className={classes.coinsWrapper}>
          <Box>
            {COINS_VALUES.map((c) => (
              <IconButton
                key={c}
                aria-label={`add ${c} cents in deposit`}
                onClick={() => handleAddToDeposit(c)}
                className={classes.coin}
              >
                &cent;{c}
              </IconButton>
            ))}
          </Box>

          <Button color="error" onClick={handleResetDeposit}>
            Reset deposit
          </Button>
        </Box>
      </Box>
    </Layout>
  )
}

export default Deposit
