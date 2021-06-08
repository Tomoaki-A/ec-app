import React,{useCallback, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import List from "@material-ui/core/List";
import { getProductsInCart } from "../reducks/users/selectors";
import {CartListItem} from "../components/Products"
import { PrimaryButton,GreyButton } from "../components/UIkit";
import {push} from 'connected-react-router'
import {makeStyles} from '@material-ui/styles'

const useStyles = makeStyles({
  root: {
    margin: '0 auto',
    maxWidth: 512,
    width: '100%'
  }
})

// カート内のページ
const CartList = () => {

  const classes = useStyles();

  // Selectorでカートに入っている商品情報を取得
  const selector = useSelector((state) => state);

  const productsInCart = getProductsInCart(selector);
  const dispatch = useDispatch();

  // onClickで使う注文確認ページへ飛ぶ処理
  const goToOrder = useCallback(() => {
    dispatch(push('/order/confirm'))
  },[])

   // onClickで使うトップページへ飛ぶ処理
   const backToTop = useCallback(() => {
    dispatch(push('/'))
  }, []);

  return (
    <section className="c-section-wrapin">
      <h2 className={"u-text__headline"}>ショッピングカート</h2>
      <List className={classes.root}>
        {/* カートに入っている商品情報が1つでもあれば個数だけコンポーネントをリスト表示 */}
        {productsInCart.length > 0 && (
          productsInCart.map(product => 
            <CartListItem key={product.cartId} product={product}/>
          )
        )}
      </List>
      <div className="module-spacer--medium"/>
      <div className="p-grid__column">
            <PrimaryButton label={"レジへ進む"} onClick={goToOrder} />
            <div className="module-spacer--extra-small"/>
            <GreyButton label={"ショッピングを続ける"} onClick={backToTop}/>
      </div>
    </section>
  );
};

export default CartList;



