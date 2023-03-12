const { calculateChange } = require("../utils/functions")

describe("calculate change", () => {
  test("there is the same amount of in deposit as total to be paid", () => {
    const change = calculateChange(5, 5)
    expect(change.length).toEqual(0)
  })

  test("there is more to pay than in deposit", () => {
    const change = calculateChange(5, 10)
    expect(change.length).toEqual(0)
  })

  test("there is nothing in deposit", () => {
    const change = calculateChange(0, 10)
    expect(change.length).toEqual(0)
  })

  test("there is nothing to be paid", () => {
    const change = calculateChange(10, 0)
    expect(change.length).toEqual(0)
  })

  test("there is double in deposit than to be paid", () => {
    const change = calculateChange(100, 50)
    const changeSum = change.reduce((acc, c) => acc + c, 0)
    expect(change).toContain(50)
    expect(changeSum).toEqual(50)
  })

  test("there is double in deposit than to be paid", () => {
    const change = calculateChange(300, 150)
    const changeSum = change.reduce((acc, c) => acc + c, 0)
    expect(change).toEqual([100, 50])
    expect(changeSum).toEqual(150)
  })

  test("there is double in deposit than to be paid", () => {
    const change = calculateChange(350, 175)
    const changeSum = change.reduce((acc, c) => acc + c, 0)
    expect(changeSum).toEqual(175)
    expect(change).toEqual([100, 50, 20, 5])
  })

  test("there is quatruple in deposit than to be paid", () => {
    const change = calculateChange(400, 100)
    const changeSum = change.reduce((acc, c) => acc + c, 0)
    expect(changeSum).toEqual(300)
    expect(change).toEqual([100, 100, 100])
  })

  test("there is quatruple in deposit than to be paid", () => {
    const change = calculateChange(20, 5)
    const changeSum = change.reduce((acc, c) => acc + c, 0)
    expect(changeSum).toEqual(15)
    expect(change).toEqual([10, 5])
  })

  test("there is quatruple in deposit than to be paid", () => {
    const change = calculateChange(40, 10)
    const changeSum = change.reduce((acc, c) => acc + c, 0)
    expect(changeSum).toEqual(30)
    expect(change).toEqual([20, 10])
  })

  test("there is ten times in deposit than to be paid", () => {
    const change = calculateChange(100, 10)
    const changeSum = change.reduce((acc, c) => acc + c, 0)
    expect(changeSum).toEqual(90)
    expect(change).toEqual([50, 20, 20])
  })

  test("there is ten times in deposit than to be paid", () => {
    const change = calculateChange(50, 5)
    const changeSum = change.reduce((acc, c) => acc + c, 0)
    expect(changeSum).toEqual(45)
    expect(change).toEqual([20, 20, 5])
  })

  test("there is ten times in deposit than to be paid", () => {
    const change = calculateChange(300, 30)
    const changeSum = change.reduce((acc, c) => acc + c, 0)
    expect(changeSum).toEqual(270)
    expect(change).toEqual([100, 100, 50, 20])
  })

  test("random numbers", () => {
    const change = calculateChange(2120, 1865)
    const changeSum = change.reduce((acc, c) => acc + c, 0)
    expect(changeSum).toEqual(255)
    expect(change).toEqual([100, 100, 50, 5])
  })
})
