const depositRouter = require("express").Router()
const Product = require("../models/product")
const middleware = require("../utils/middleware")
const User = require("../models/user")
const { COINS_VALUES } = require("../utils/constants")

depositRouter.post("/", async (request, response) => {
  const user = request.user
  const { coin } = request.body

  if (user.role === "BUYER" && COINS_VALUES.some((value) => value === coin)) {
    const { deposit } = await User.findById(user._id)
    const newDeposit = deposit + coin

    const result = await User.findByIdAndUpdate(
      user._id,
      { deposit: newDeposit },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    )

    if (result) {
      response.json({ deposit: newDeposit }).end()
    }
  } else if (!COINS_VALUES.some((value) => value === coin)) {
    response
      .status(400)
      .send({
        error:
          "The value of your coin must be one number of: 5, 10, 20, 50, 100",
      })
      .end()
  } else {
    response
      .status(403)
      .send({
        error: "You do not have permission to add coins to your deposit",
      })
      .end()
  }
})

module.exports = depositRouter
