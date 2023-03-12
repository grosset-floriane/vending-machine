require("dotenv").config()

/*eslint no-undef: "error"*/
/*eslint-env node*/
const PORT = process.env.PORT
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT,
}
