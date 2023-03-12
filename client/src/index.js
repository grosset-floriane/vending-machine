import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "./index.css"
import { store } from "./store/store"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"

const theme = createTheme({
  palette: {
    primary: {
      main: "#663399",
    },
    secondary: {
      main: "#E5CC63",
    },
  },
})

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
)
