const config = require("./utils/config")
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const productsRouter = require("./controllers/products")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const depositRouter = require("./controllers/deposit")
const buyRouter = require("./controllers/buy")
const resetRouter = require("./controllers/reset")
const middleware = require("./utils/middleware")
const logger = require("./utils/logger")
const mongoose = require("mongoose")
const morgan = require("morgan")

morgan.token("content", function (req) {
  return JSON.stringify(req.body)
})

logger.info("connecting to", config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message)
  })

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
)
app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(middleware.requestLogger)

// Routes outside authentification
app.use("/login", loginRouter)
app.use("/users", usersRouter)

// Routes that require authentication
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)
app.use("/products", productsRouter)
app.use("/deposit", depositRouter)
app.use("/buy", buyRouter)
app.use("/reset", resetRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
