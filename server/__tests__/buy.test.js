const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("../utils/testHelper")
const app = require("../app")
const User = require("../models/user")
const Product = require("../models/product")

const api = supertest(app)
const username = "Barbara"

describe("Buy a product", () => {
  beforeAll(async () => {
    await User.deleteMany({})
    await Product.deleteMany({})
    const userID = await helper.registerUser("SELLER")
    await helper.addAProduct(userID)

    // register BUYER user
    await helper.registerUser("BUYER", username)
  })

  test("an anonymous user cannot cannot buy a product", async () => {
    const products = await Product.find({})
    await api
      .post("/buy")
      .send({ productId: products[0]._id, amount: 1 })
      .expect(401)
      .expect("Content-Type", /application\/json/)
  })

  test("a logged in user with role SELLER cannot buy", async () => {
    const products = await Product.find({})

    const token = await helper.login()
    const result = await api
      .post("/buy")
      .send({ productId: products[0]._id, amount: 1 })
      .set("Authorization", `Bearer ${token}`)
      .expect(403)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(
      "You don't have the permission to do this"
    )
  })

  test("a logged in user with role BUYER cannot buy if there is not enough amountAvailable", async () => {
    const products = await Product.find({})
    // Login with BUYER user
    const token = await helper.login(username)
    const result = await api
      .post("/buy")
      .send({ productId: products[0]._id, amount: 3 })
      .set("Authorization", `Bearer ${token}`)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(
      "There is not enough test product in storage to procede. Only 2 left."
    )
  })

  test("a logged in user with role BUYER cannot buy if try to buy 0 amount", async () => {
    const products = await Product.find({})
    // Login with BUYER user
    const token = await helper.login(username)
    const result = await api
      .post("/buy")
      .send({ productId: products[0]._id, amount: 0 })
      .set("Authorization", `Bearer ${token}`)
      .expect(403)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(
      "There is nothing to buy or no cost involved"
    )
  })

  test("a logged in user with role BUYER cannot buy if they have not enough in deposit", async () => {
    const products = await Product.find({})
    // Login with BUYER user
    const token = await helper.login(username)
    const result = await api
      .post("/buy")
      .send({ productId: products[0]._id, amount: 2 })
      .set("Authorization", `Bearer ${token}`)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(
      "You don't have enough to pay for the order. Currently available: 15"
    )
  })

  test("a logged in user with role BUYER can buy if all the above is true", async () => {
    const products = await Product.find({})
    const userBeforeBuying = await User.find({ username })
    expect(userBeforeBuying[0].deposit).toEqual(15)
    // Login with BUYER user
    const token = await helper.login(username)
    const result = await api
      .post("/buy")
      .send({ productId: products[0]._id, amount: 1 })
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    // Response is conform
    expect(result.body.totalPaid).toBe(10)
    expect(result.body.change).toContain(5)
    expect(result.body.change.reduce((acc, c) => acc + c, 0)).toEqual(
      userBeforeBuying[0].deposit - products[0].cost
    )
    expect(result.body.products.productId).toEqual(products[0]._id.toString())
    expect(result.body.products.productName).toBe("test product")
    expect(result.body.products.amount).toEqual(1)

    // User is updated
    const userAfterBuying = await User.find({ username })
    expect(userAfterBuying[0].deposit).toEqual(0)

    // Product is updated
    const productAfterBuying = await Product.find({})
    expect(productAfterBuying[0].amountAvailable).toEqual(1)
  })
})
