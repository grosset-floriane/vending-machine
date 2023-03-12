const mongoose = require("mongoose")
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  cost: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v % 5 === 0,
      message: "must be multiple of 5.",
    },
    min: 5,
  },
  amountAvailable: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "must be an integer",
    },
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Product", productSchema)
