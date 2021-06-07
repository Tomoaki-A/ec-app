import React from "react";

import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { makeStyles } from "@material-ui/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { useSelector } from "react-redux";
import { getUserId } from "../../reducks/users/selectors";
import { db } from "../../firebase/index";

const useStyles = makeStyles({
  list: {
    height: 128,
  },
  image: {
    objectFit: "cover",
    margin: 16,
    height: 96,
    width: 96,
  },
  text: {
    width: "100%",
  },
});

const CartListItem = (props) => {
  const classes = useStyles();
  // Selectorで操作しているユーザーのIDを取得
  const selector = useSelector((state) => state);

  // propsで渡ってきた商品情報を定数化
  const image = props.product.images[0].path;
  const price = props.product.price.toLocaleString();
  const name = props.product.name;
  const size = props.product.size;

  // カートから消去する関数
  // 商品のカートidを受け取り
  // カートidに対応する商品をFirebaseのデータベースから削除
  const removeProductFromCart = (id) => {
    const uid = getUserId(selector);
    return db.collection("users").doc(uid).collection("cart").doc(id).delete();
  };

  return (
    <>
      <ListItem className={classes.list}>
        <ListItemAvatar>
          <img className={classes.image} src={image} alt="商品画像" />
        </ListItemAvatar>
        <div className={classes.text}>
          <ListItemText primary={name} secondary={"サイズ" + size} />
          <ListItemText primary={"¥" + price} />
        </div>
        {/* 消去アイコンのonClickで上で定義した関数を実行 */}
        <IconButton onClick={() => removeProductFromCart(props.product.cartId)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
      <Divider />
    </>
  );
};

export default CartListItem;
