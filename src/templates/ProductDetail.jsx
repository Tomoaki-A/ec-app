import {React,useState,useCallback,useEffect} from 'react'
import { db,FirebaseTimestamp } from '../firebase';
import {useDispatch, useSelector} from "react-redux"
import { makeStyles } from '@material-ui/styles';
import HTMLReactParser from 'html-react-parser'
import {ImageSwiper ,SizeTable} from "../components/Products/index"
import {addProductToCart} from '../reducks/users/opeations'



const useStyles = makeStyles((theme) => ({
  sliderBox: {
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto 24px auto',
      height: 320,
      width: 320,
    },
    [theme.breakpoints.up('sm')]: {
      margin: '0 auto',
      height: 400,
      width: 400,
    },
  },
  detail: {
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto 16px auto',
      height: "auto",
      width: 320,
    },
    [theme.breakpoints.up('sm')]: {
      margin: '0 auto',
      height: "auto",
      width: 400,
    },
  },
  proce :{
    fontSize: 36,
  }
}))


const returnCodeToBr = (text) => {
  if (text === "") {
      return text
  } else {
      return HTMLReactParser(text.replace(/\r?\n/g, '<br/>'))
  }
};

const ProductDetail = () => {
  const selector = useSelector(state => state);
  const path = selector.router.location.pathname;
  const id = path.split('/product/')[1];
  const [product, setProduct] =useState(null);
  const dispatch = useDispatch();
  
const classes = useStyles();

// カートのアイコンをクリックした時に実行する関数
// 商品の情報をFirebaseに登録するため渡す
const addProduct = useCallback((selectedSize) => {
  // 現在のタイムスタンプ取得
  const timestamp = FirebaseTimestamp.now();
  // operationsへディスパッチ
  dispatch(addProductToCart({
    added_at: timestamp,
    description: product.description,
    gender: product.description,
    images: product.images,
    name: product.name,
    proce: product.price,
    productId: product.id,
    quantity: 1,
    size: selectedSize,
  }))
},[product])

// 更新のたび現在のidのデータを取得しローカルのproductに入れる
useEffect(() => {
  db.collection('products').doc(id).get()
    .then(doc => {
      const data = doc.data();
      setProduct(data);
    })
},[]);
  return(

    <section className="c-section-wrapin">
      {product && (
        <div className="p-grid__row">
          <div className={classes.sliderBox}>
          <ImageSwiper images={product.images}/>
          </div>
          <div className={classes.detail}>
          <h2 className="u-text__headline">{product.name}</h2>
          <p className={classes.price}>¥{product.price.toLocaleString()}</p>
          <div className="module-spacer--small" />
          <SizeTable sizes={product.sizes} addProduct={addProduct}/>
          <div className="module-spacer--small" />
          <p>{returnCodeToBr(product.description)}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetail;