const supertest = require("supertest")
const helper = require("../utils/testHelper")
const app = require("../app")
const User = require("../models/user")

const api = supertest(app)

const username = "Barbara"

describe("User GET", () => {
  beforeAll(async () => {
    await User.deleteMany({})
    await helper.registerUser("SELLER")
    await helper.registerUser("BUYER", username)
  })

  describe("GET all users", () => {
    test("should fail if access without auth", async () => {
      await api
        .get("/users")
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })

    test("should success with auth as a SELLER", async () => {
      const token = await helper.login()
      await api
        .get("/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)
    })

    test("should success with auth as a BUYER", async () => {
      const token = await helper.login(username)
      await api
        .get("/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)
    })
    test("should success and respond with a list of users", async () => {
      const token = await helper.login()
      const response = await api
        .get("/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(response.body.length).toEqual(2)
      const firstUser = response.body[0]
      expect(firstUser.deposit).toBeDefined()
      expect(typeof firstUser.deposit).toBe("number")
      expect(firstUser.username).toBeDefined()
      expect(firstUser.role).toBeDefined()
      expect(firstUser.role).toBe("SELLER")
      expect(firstUser.id).toBeDefined()
      expect(firstUser._id).not.toBeDefined()
      expect(firstUser.password).not.toBeDefined()
    })
  })

  describe("GET one user", () => {
    test("should fail if access without auth", async () => {
      const users = await User.find({})
      await api
        .get(`/users/${users[0]._id}`)
        .expect(401)
        .expect("Content-Type", /application\/json/)
    })

    test("should fail if accessing an unexisting user", async () => {
      const token = await helper.login(username)
      const response = await api
        .patch("/users/640b8623d64f4871aac93e82")
        .send({ username: "Almond" })
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .expect("Content-Type", /application\/json/)

      expect(response.body.error).toContain("This user does not exist.")
    })

    test("should success with auth as a SELLER", async () => {
      const token = await helper.login()
      const users = await User.find({})
      await api
        .get(`/users/${users[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)
    })

    test("should success with auth as a BUYER", async () => {
      const token = await helper.login(username)
      const users = await User.find({})
      await api
        .get(`/users/${users[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)
    })

    test("should return the user's object", async () => {
      const token = await helper.login(username)
      const users = await User.find({})
      const response = await api
        .get(`/users/${users[0]._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)

      expect(typeof response.body).toBe("object")
      expect(response.body.deposit).toBeDefined()
      expect(typeof response.body.deposit).toBe("number")
      expect(response.body.username).toBeDefined()
      expect(response.body.role).toBeDefined()
      expect(response.body.role).toBe("SELLER")
      expect(response.body.id).toBeDefined()
      expect(response.body._id).not.toBeDefined()
      expect(response.body.password).not.toBeDefined()
    })
  })
})
