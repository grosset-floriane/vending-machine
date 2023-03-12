const resetRouter = require("express").Router()
const User = require("../models/user")

resetRouter.post("/", async (request, response) => {
  const { id: userID } = request.user
  const userInDB = await User.findById(userID)
  if (userInDB && userInDB.role === "SELLER") {
    return response
      .status(403)
      .send({ error: "Only BUYER users can reset their deposit" })
      .end()
  }
  const result = await User.findByIdAndUpdate(userID, { deposit: 0 })
  if (result) {
    response.json({ deposit: 0 }).end()
  }
})

module.exports = resetRouter
