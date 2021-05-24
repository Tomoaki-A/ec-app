import React, { useEffect } from 'react'
import {ProductCard} from '../components/Products/index'
import {useDispatch, useSelector} from "react-redux";
import {fetchProducts} from "../reducks/products/operations"
import {getProducts} from '../reducks/products/selectors'


const ProductList = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const products = getProducts(selector)

  useEffect(() => {
    dispatch(fetchProducts())
},[]);

  return(
    <section className="c-section-wrapin">
      <div className="p-grid__row">
      {products.length > 0 && (
        products.map(product => (
          <ProductCard key={product.id} price={product.price} images={product.images} name={product.name} id={product.id}/>
        ))
      )
      }
      </div>
    </section>
  )
}

export default ProductList;