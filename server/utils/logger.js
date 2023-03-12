/*eslint no-undef: "error"*/
/*eslint-env node*/
const info = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params)
  }
}

module.exports = {
  info,
  error,
}
