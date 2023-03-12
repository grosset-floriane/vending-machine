const bcrypt = require("bcrypt")
const supertest = require("supertest")
const helper = require("../utils/testHelper")
const app = require("../app")
const User = require("../models/user")

const api = supertest(app)

describe("User creation POST", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("sekret", 10)
    const user = new User({
      username: "root",
      password: passwordHash,
      role: "BUYER",
      deposit: 0,
    })

    await user.save()
  })

  test("succeeds with a fresh username or BUYER role", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "albertine",
      role: "BUYER",
      password: "superpassword",
    }

    await api
      .post("/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test("succeeds with a fresh username or SELLER role", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "albertine",
      role: "SELLER",
      password: "superpassword",
    }

    await api
      .post("/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test("fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "root",
      role: "BUYER",
      password: "anotherpassword",
    }

    const result = await api
      .post("/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("This username is not available.")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test("fails with proper statuscode and message if the role is not BUYER or SELLER", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "Gerard",
      role: "BLAH",
      password: "anotherpassword",
    }

    const result = await api
      .post("/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(
      "User validation failed: role: `BLAH` is not a valid enum value for path `role`."
    )

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test("fails with proper statuscode and message if password is too short", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "myusername",
      role: "BUYER",
      password: "my",
    }

    const result = await api
      .post("/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(
      "Password must be at least 3 characters"
    )

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test("fails with proper statuscode and message if username is too short", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "my",
      role: "BUYER",
      password: "mypassword",
    }

    const result = await api
      .post("/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain(
      `User validation failed: username: Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3).`
    )

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})
