import React, { useEffect,useState } from 'react'
import {ProductCard} from '../components/Products/index'
import {useDispatch, useSelector} from "react-redux";
import {fetchProducts} from "../reducks/products/operations"
import {getProducts} from '../reducks/products/selectors'


const ProductList = () => {
  const dispatch = useDispatch();
  // useSelector()でstoreの全てのstateを取得し、reduxのselector(全てのstateからproductに関するstateを返す関数)に渡す

  const selector = useSelector((state) => state);
  const products = getProducts(selector)

  // 更新の旅にproducts配列(中身は1つ1つの商品情報)を返す
  useEffect(() => {
    dispatch(fetchProducts())
    console.log(products)
},[]);

  return(
    <section className="c-section-wrapin">
      <div className="p-grid__row">
      {/* products配列(中身は1つ1つの商品情報)の数だけmapで<ProductCard/>を呼びだす */}
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