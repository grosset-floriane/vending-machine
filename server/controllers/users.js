const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")
const Product = require("../models/product")
const middleware = require("../utils/middleware")

const authMiddlewares = [middleware.tokenExtractor, middleware.userExtractor]

usersRouter.post("/", async (request, response) => {
  const { username, password, role } = request.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response
      .status(400)
      .json({
        error: "This username is not available.",
      })
      .end()
  }

  if (password.length < 3) {
    return response
      .status(400)
      .send({
        error: "Password must be at least 3 characters",
      })
      .end()
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // check if the role is one of the roles or do we get error if not?
  const user = new User({
    username,
    role,
    password: passwordHash,
    deposit: 0,
  })

  const savedUser = await user.save()
  console.log(savedUser)
  response.status(201).json(savedUser).end()
})

usersRouter.get("/", authMiddlewares, async (request, response) => {
  const users = await User.find({})
  response.json(users).end()
})

usersRouter.get("/:id", authMiddlewares, async (request, response) => {
  const user = await User.findById(request.params.id)
  if (!user) {
    return response
      .status(404)
      .json({ error: "This user does not exist." })
      .end()
  }
  response.json(user).end()
})

usersRouter.patch("/:id", authMiddlewares, async (request, response) => {
  const { username, password } = request.body
  const user = request.user
  const userInDB = await User.findById(request.params.id)
  if (!userInDB) {
    return response
      .status(404)
      .json({ error: "This user does not exist." })
      .end()
  }

  if (!password || password.length < 3 || !username) {
    return response
      .status(400)
      .json({ error: "Password and username must be defined." })
      .end()
  }

  if (user._id.toString() === request.params.id) {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      {
        username,
        password: passwordHash,
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    )

    if (updatedUser) {
      response.json(updatedUser).end()
    }
  } else {
    response
      .status(403)
      .send({ error: "You do not have permission to update this user." })
      .end()
  }
})

usersRouter.delete("/:id", authMiddlewares, async (request, response) => {
  const userInDB = await User.findById(request.params.id)
  const user = request.user
  if (!userInDB) {
    return response
      .status(404)
      .json({ error: "This user does not exist." })
      .end()
  } else if (user._id.toString() === request.params.id) {
    const result = await User.findByIdAndRemove(request.params.id)
    if (user.role === "SELLER") {
      await Product.remove({ sellerId: user._id })
    }
    if (result) {
      response.status(204).end()
    }
  } else {
    response
      .status(403)
      .send({ error: "You do not have permission to delete this user." })
      .end()
  }
})

module.exports = usersRouter
