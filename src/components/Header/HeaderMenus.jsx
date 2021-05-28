import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FacoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import MenuIcon from "@material-ui/icons/Menu";
import { getProductsInCart, getUserId } from "../../reducks/users/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { db } from "../../firebase/index";
import {fetchProductsInCart} from '../../reducks/users/opeations'

const HeaderMenus = (props) => {
  const dispatch = useDispatch();
  const selector = useSelector((state)=>state)
  const uid = getUserId(selector)
  let productsInCart = getProductsInCart(selector)

  useEffect(() => {
    // ユーザーのidに紐づけられたカートの中の情報を
    const unsubscribe = db
      .collection("users")
      .doc(uid)
      .collection("cart")
      // onSnapshotでリッスン
      .onSnapshot((snapshots) => {
        // カートの情報をforEachで回すがdocChanges()によってchamgeには
        // 新規作成(added)、修正(modified)、削除(removed)のうちどれが行われたか女方が含まれる
        snapshots.docChanges().forEach((change) => {
          // 商品1つ1つのデータを定義
          const product = change.doc.data();
          // 変更内容によって新規作成(added)、修正(modified)、削除(removed)のどれかが入る
          const changeType = change.type;

          // changeTypeによって様々な処理
          switch (changeType) {
            case "added":
              // storeのカート情報に追加
              productsInCart.push(product);
              break;
            case "modified":
              // 今forEachで回してる商品情報がproductsInCartの何番目か取得
              const index = productsInCart.findIndex(
                (product) => product.cartId === change.doc.id
              );
              // storeのカート情報のindex番目を上書き
              productsInCart[index] = product;
              break;
            case "removed":
              // 今forEachで回してる商品情報のid以外のものを抽出し新しくstoreのカート情報を再定義
              productsInCart = productsInCart.filter(
                (product) => product !== change.doc.id
              );
              break;
            default:
              break;
          }
        });
        // storeのカートの商品情報を更新するoperation関数
        dispatch(fetchProductsInCart(productsInCart));
      });
    // コールバックの形で関数を呼び出す
    // これによりコンポーネントの描画が終了したタイミングでリスナーが解除される
    return () => unsubscribe();
  }, []);

  return (
    <>
      <IconButton>
        {/* Firebaseのuser.cartの商品情報のデータの数を表示 */}
        <Badge  badgeContent={productsInCart.length} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <IconButton>
        <FacoriteBorderIcon />
      </IconButton>
      <IconButton onClick={(event) => props.handleDrawerToggle(event)}>
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default HeaderMenus;
