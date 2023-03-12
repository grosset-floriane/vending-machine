const supertest = require("supertest")
const helper = require("../utils/testHelper")
const app = require("../app")
const User = require("../models/user")
const Product = require("../models/product")

const api = supertest(app)

const username = "Barbara"

describe("User DELETE", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await helper.registerUser("SELLER")
    await helper.registerUser("BUYER", username)
  })

  test("should fail if access without auth", async () => {
    const users = await User.find({})
    await api
      .delete(`/users/${users[0]._id}`)
      .expect(401)
      .expect("Content-Type", /application\/json/)
  })

  test("should fail if trying to delete another user then themselves", async () => {
    const users = await User.find({})
    const token = await helper.login(username)
    await api
      .delete(`/users/${users[0]._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403)
      .expect("Content-Type", /application\/json/)
  })

  test("should fail if the user does not exist", async () => {
    const token = await helper.login(username)
    const response = await api
      .delete("/users/640b8623d64f4871aac93e82")
      .set("Authorization", `Bearer ${token}`)
      .expect(404)
      .expect("Content-Type", /application\/json/)

    expect(response.body.error).toContain("This user does not exist.")
  })

  test("should success as a BUYER user", async () => {
    const users = await User.find({})
    const token = await helper.login(username)
    await api
      .delete(`/users/${users[1]._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const usersAfterDeletion = await User.find({})
    const isDeletedUser = usersAfterDeletion.some((u) => u._id === users[1]._id)
    expect(isDeletedUser).toBe(false)
    expect(usersAfterDeletion.length).toBe(1)
  })

  test("should success as a SELLER user", async () => {
    const users = await User.find({})
    const userID = users[0]._id

    await helper.addAProduct(userID)
    await helper.addAProduct(userID)
    await helper.addAProduct("640b8623d64f4871aac93e82")
    await helper.addAProduct("640b8623d64f4871aac93e82")

    const token = await helper.login()
    await api
      .delete(`/users/${userID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const usersAfterDeletion = await User.find({})
    const isDeletedUser = usersAfterDeletion.some((u) => u._id === userID)
    expect(isDeletedUser).toBe(false)
    expect(usersAfterDeletion.length).toBe(1)

    const productsAfterDeletion = await Product.find({})
    const isProductsOfDeletedUser = productsAfterDeletion.some(
      (p) => p.sellerId === userID
    )
    const isProductsOfOtherUsers = productsAfterDeletion.some(
      (p) => p.sellerId !== userID
    )
    expect(isProductsOfDeletedUser).toBe(false)
    expect(isProductsOfOtherUsers).toBe(true)
  })
})
