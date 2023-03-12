const productsRouter = require("express").Router()
const Product = require("../models/product")
const middleware = require("../utils/middleware")

const middlewares = [middleware.tokenExtractor, middleware.userExtractor]

productsRouter.get("/", async (request, response) => {
  const products = await Product.find({})
  response.json(products).end()
})

productsRouter.post("/", middlewares, async (request, response) => {
  const user = request.user
  // check if user exist in db

  if (user.role === "SELLER") {
    const newProduct = await {
      ...request.body,
      sellerId: user._id,
    }
    const product = new Product(newProduct)
    const savedProduct = await product.save()
    response.status(201).json(savedProduct).end()
  } else {
    response
      .status(403)
      .send({ error: "You do not have permission to do this" })
      .end()
  }
})

productsRouter.put("/:id", middlewares, async (request, response) => {
  const user = request.user
  const product = await Product.findById(request.params.id)
  if (!product) {
    response.status(404).send("This product does not exist").end()
  }

  // check product requirement string length > 0
  // amount int
  // cost divisible / 5

  if (
    user.role === "SELLER" &&
    user._id.toString() === product.sellerId.toString()
  ) {
    const updatedProduct = await Product.findByIdAndUpdate(
      request.params.id,
      { ...request.body },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    )

    if (updatedProduct) {
      response.json(updatedProduct).end()
    }
  } else {
    response
      .status(403)
      .send({ error: "You do not have permission to do this" })
      .end()
  }
})

productsRouter.delete("/:id", middlewares, async (request, response) => {
  const user = request.user

  const product = await Product.findById(request.params.id)

  if (!product) {
    response.status(404).send("This product does not exist").end()
  }

  if (
    user.role === "SELLER" &&
    user._id.toString() === product.sellerId.toString()
  ) {
    const result = await Product.findByIdAndRemove(request.params.id)
    if (result) {
      response.status(204).end()
    }
  } else {
    response
      .status(400)
      .send({ error: "You do not have permission to delete this product" })
      .end()
  }
})

module.exports = productsRouter
