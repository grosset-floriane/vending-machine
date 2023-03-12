import React from "react"
import { Routes, Route } from "react-router-dom"
import Login from "./component-pages/Login"
import Products from "./component-pages/Products/Products"
import SingleProduct from "./component-pages/SingleProduct"
import AddProduct from "./component-pages/AddProduct"
import MyAccount from "./component-pages/MyAccount"
import Deposit from "./component-pages/Deposit"
import EditAccount from "./component-pages/EditAccount"
import NotFound from "./component-pages/NotFound"

const Pages = () => {
  return (
    <Routes>
      <Route path="/my-account">
        <Route path="update" element={<EditAccount />} />
        <Route path="" element={<MyAccount />} />
      </Route>
      <Route path="/my-deposit" element={<Deposit />} />
      <Route path="/products">
        <Route path="add-product" element={<AddProduct />} />
        <Route path=":id" element={<SingleProduct />} />
        <Route path="" element={<Products />} />
      </Route>
      <Route path="/" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Pages
