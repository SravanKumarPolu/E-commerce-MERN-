import React, { useContext } from 'react'

import { ShopContext } from '../context/ShopContext'

const LatestCollection = () => {
  const context = useContext(ShopContext); // Get the context

  // Handle undefined context
  if (!context) {
    return <div>No products available</div>;
  }

  const { products } = context;

  console.log(products)
  return (
    <div>LatestCollection</div>
  )
}

export default LatestCollection