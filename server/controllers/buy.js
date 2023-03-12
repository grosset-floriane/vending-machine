const buyRouter = require("express").Router()
const Product = require("../models/product")
const User = require("../models/user")
const { calculateChange } = require("../utils/functions")

buyRouter.post("/", async (request, response) => {
  const user = request.user
  // get deposit of user
  const { deposit, role } = await User.findById(user._id)

  if (role === "SELLER") {
    return response
      .status(403)
      .send({ error: "You don't have the permission to do this" })
      .end()
  }

  // receives: productId, amount
  const { productId, amount } = request.body

  // get product unit cost
  const product = await Product.findById(productId)
  const { amountAvailable, productName, cost } = product

  // check if there is enough quantity in storage
  if (amountAvailable < amount) {
    return response
      .status(400)
      .send({
        error: `There is not enough ${productName} in storage to procede. ${
          amountAvailable > 0 ? `Only ${amountAvailable}` : "Nothing"
        } left.`,
      })
      .end()
  }

  // calculate the total to be paid
  const totalToPay = cost * amount

  // if amount is 0 or total to pay is 0
  if (amount === 0 || totalToPay === 0) {
    return response
      .status(403)
      .send({ error: "There is nothing to buy or no cost involved" })
      .end()
  }

  // check that the user has enough in its deposit to buy the product in that amount
  if (totalToPay > deposit) {
    return response
      .status(400)
      .send({
        error: `You don't have enough to pay for the order. Currently available: ${deposit}`,
      })
      .end()
  }

  // calculate change to give back
  const change = calculateChange(deposit, totalToPay)

  // update user with new deposit of 0
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { deposit: 0 },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )

  // update product with new quantity available
  const updatedProduct = await Product.findByIdAndUpdate(productId, {
    amountAvailable: amountAvailable - amount,
  })
  if (updatedUser && updatedProduct) {
    return response
      .send({
        totalPaid: totalToPay,
        change,
        products: { productName, productId, amount },
      })
      .end()
  }
})

module.exports = buyRouter
