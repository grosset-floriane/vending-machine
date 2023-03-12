const supertest = require("supertest")
const helper = require("../utils/testHelper")
const app = require("../app")
const User = require("../models/user")

const api = supertest(app)

const username = "Barbara"

describe("User update PATCH", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await helper.registerUser("SELLER")
    await helper.registerUser("BUYER", username)
  })

  test("should fail if tryed without auth", async () => {
    const users = await User.find({})
    await api
      .patch(`/users/${users[0]._id}`)
      .send({ username: "Almond" })
      .expect(401)
      .expect("Content-Type", /application\/json/)
  })

  test("should fail if username is empty string", async () => {
    const users = await User.find({})
    const token = await helper.login()
    const response = await api
      .patch(`/users/${users[0]._id}`)
      .send({ username: "", password: "newPassword" })
      .set("Authorization", `Bearer ${token}`)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(response.body.error).toContain(
      "Password and username must be defined."
    )
  })

  test("should fail if password is empty string", async () => {
    const users = await User.find({})
    const token = await helper.login()
    const response = await api
      .patch(`/users/${users[0]._id}`)
      .send({ username: "Almond", password: "" })
      .set("Authorization", `Bearer ${token}`)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(response.body.error).toContain(
      "Password and username must be defined."
    )
  })

  test("should fail if accessed by another user", async () => {
    const users = await User.find({})
    const token = await helper.login(username)
    const response = await api
      .patch(`/users/${users[0]._id}`)
      .send({ username: "Almond", password: "newPassword" })
      .set("Authorization", `Bearer ${token}`)
      .expect(403)
      .expect("Content-Type", /application\/json/)

    expect(response.body.error).toContain(
      "You do not have permission to update this user."
    )
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

  test("can update their username and password", async () => {
    const users = await User.find({})
    const token = await helper.login()
    const response = await api
      .patch(`/users/${users[0]._id}`)
      .send({ username: "Almond", password: "newPassword" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    // Username is updated
    expect(response.body.username).toBe("Almond")

    // Role was not updated
    expect(response.body.role).toBe("SELLER")
    expect(response.body.role).toBe(users[0].role)

    // Deposit is not updated
    expect(typeof response.body.deposit).toBe("number")
    expect(response.body.deposit).toEqual(users[0].deposit)

    // Password is updated
    const userAfterUpdate = await User.findById(users[0]._id)
    expect(userAfterUpdate.password.length).toEqual(60)
    expect(userAfterUpdate.password).not.toEqual(users[0].password)

    // Password is not sent as part of the new  user object
    expect(response.body.password).not.toBeDefined()
  })

  test("cannot update their role or deposit", async () => {
    const users = await User.find({})
    const token = await helper.login()
    const response = await api
      .patch(`/users/${users[0]._id}`)
      .send({
        username: "Almond",
        password: "newPassword",
        role: "BUYER",
        deposit: 500,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    // Role was not updated
    expect(response.body.role).toBe("SELLER")
    expect(response.body.role).toBe(users[0].role)

    // Deposit is not updated
    expect(typeof response.body.deposit).toBe("number")
    expect(response.body.deposit).toEqual(users[0].deposit)
  })
})
