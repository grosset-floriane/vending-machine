import React, { useEffect } from "react"
import { Table, TableCell, TableRow, TableHead, TableBody } from "@mui/material"
import { useTypedSelector } from "../../store/typedSelector"
import { useAppDispatch } from "../../store/store"
import { getAllProducts } from "../../store/slices/products"
import { Link } from "react-router-dom"

const ProductsList = () => {
  const { products, isLoading } = useTypedSelector((state) => state.products)
  const dispatch = useAppDispatch()
  const productStyle = {
    border: "1px solid black",
    marginTop: 8,
    padding: 16,
  }

  useEffect(() => {
    dispatch(getAllProducts())
  }, [])

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Product name</TableCell>
          <TableCell>Cost</TableCell>
          <TableCell>Amount available</TableCell>
          <TableCell>Details</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map(({ id, productName, amountAvailable, cost }) => (
          <TableRow
            key={id}
            className="product"
            style={productStyle}
            data-testid={`product-${id}`}
          >
            <TableCell>{productName}</TableCell>
            <TableCell>{cost}</TableCell>
            <TableCell>{amountAvailable}</TableCell>
            <TableCell>
              <Link to={`/products/${id}`}>Details</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ProductsList
