const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minLength: 3 },
  password: { type: String, required: true, minLength: 3 },
  deposit: { type: Number, required: true },
  role: { type: String, required: true, enum: ["SELLER", "BUYER"] },
})

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  },
})

const User = mongoose.model("User", userSchema)

module.exports = User
