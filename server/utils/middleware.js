const jwt = require("jsonwebtoken")
const logger = require("./logger")
const User = require("../models/user")

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("Body:  ", request.body)
  logger.info("---")
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" }).end()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" }).end()
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message }).end()
  } else if (error.name === "JsonWebTokenError") {
    return response
      .status(401)
      .json({
        error: "invalid token",
      })
      .end()
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization")
  const token =
    authorization && authorization.toLowerCase().startsWith("bearer ")
      ? authorization.substring(7)
      : null

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ eror: "token missing or invalid" }).end()
  }

  request.token = decodedToken
  next()
}

const userExtractor = async (request, response, next) => {
  const { token } = request
  const user = await User.findById(token.id)
  request.user = user
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
