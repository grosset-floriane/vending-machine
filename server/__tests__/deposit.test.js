const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("../utils/testHelper")
const app = require("../app")
const User = require("../models/user")

const api = supertest(app)

describe("Add a coin", () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })
  test("an anonymous user cannot deposit coins", async () => {
    await api
      .post("/deposit")
      .send({ coin: 5 })
      .expect(401)
      .expect("Content-Type", /application\/json/)
  })

  test("a logged in user with role SELLER cannot deposit coins", async () => {
    await helper.registerUser("SELLER")
    const token = await helper.login()
    const result = await api
      .post("/deposit")
      .send({ coin: 5 })
      .set("Authorization", `Bearer ${token}`)
      .expect(403)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(
      "You do not have permission to add coins to your deposit"
    )
  })

  test("a logged in user with role BUYER can deposit coins with valid value", async () => {
    await helper.registerUser("BUYER")
    const token = await helper.login()
    await api
      .post("/deposit")
      .send({ coin: 5 })
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("a logged in user with role BUYER cannot deposit coins with invalid value", async () => {
    await helper.registerUser("BUYER")
    const token = await helper.login()
    const result = await api
      .post("/deposit")
      .send({ coin: 7 })
      .set("Authorization", `Bearer ${token}`)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(
      "The value of your coin must be one of: 5, 10, 20, 50, 100"
    )
  })
})
