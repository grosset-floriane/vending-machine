const Product = require("../models/product")
const User = require("../models/user")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const bcrypt = require("bcrypt")

// const blogsInDb = async () => {
//   const blogs = await Blog.find({})
//   return blogs.map((blog) => blog.toJSON())
// }

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const registerUser = async (role = "BUYER", username = "root") => {
  const passwordHash = await bcrypt.hash("sekret", 10)
  const user = new User({
    username,
    password: passwordHash,
    role,
    deposit: 15,
  })

  return await (
    await user.save()
  )._id
}

const addAProduct = async (sellerId) => {
  const product = new Product({
    productName: "test product",
    amountAvailable: 2,
    cost: 10,
    sellerId,
  })

  await product.save()
}

const login = async (username = "root") => {
  const response = await api
    .post("/login")
    .send({ username, password: "sekret" })

  return response.body.token
}

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
]

module.exports = {
  initialBlogs,
  usersInDb,
  login,
  registerUser,
  addAProduct,
}
