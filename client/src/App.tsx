import React, { useEffect } from "react"
import { setUser, getUser } from "./store/slices/user"
import { useAppDispatch } from "./store/store"
import { setToken } from "./services/api"
import Pages from "./Pages"
import { useTypedSelector } from "./store/typedSelector"

const App = () => {
  const dispatch = useAppDispatch()
  const { id: userID } = useTypedSelector((state) => state.user)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedAppUser")
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      dispatch(setUser(loggedUser))
      setToken(loggedUser.token)
    }
  }, [])

  useEffect(() => {
    if (userID) {
      dispatch(getUser(userID))
    }
  }, [userID])

  return <Pages />
}

export default App
