const { COINS_VALUES } = require("./constants")

const calculateChange = (deposit, totalToPay) => {
  let change = []
  if (totalToPay > deposit || deposit <= 0 || totalToPay <= 0) return change
  const rest = deposit - totalToPay
  if (rest > 0) {
    COINS_VALUES.reduce((accumulator, current) => {
      if (rest === 0) return
      const nbOfCoins = Math.floor(accumulator / current)
      if (nbOfCoins) {
        change.push(...Array.from({ length: nbOfCoins }, () => current))
      }
      return accumulator - nbOfCoins * current
    }, rest)
  }

  return change
}

module.exports = {
  calculateChange,
}
