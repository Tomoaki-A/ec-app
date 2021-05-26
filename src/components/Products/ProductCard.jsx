import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import NoImage from "../../assets/img/src/no_image.png";
import { push } from "connected-react-router";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../reducks/products/operations";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      margin: 8,
      width: "calc(50% - 16px)",
    },
    [theme.breakpoints.up("md")]: {
      margin: 16,
      width: "calc(33.3333% - 32px)",
    },
  },
  content: {
    display: "flex",
    padding: "16 8",
    textAlign: "left",
    "&:last-child": {
      paddingBottom: 16,
    },
  },
  icon: {
    marginRight: 0,
    marginLeft: "auto",
  },
  media: {
    height: 0,
    paddingTop: "100%",
  },
  price: {
    color: theme.palette.secondary,
    fontSize: 16,
  },
  productName: {
    boxOrient: "vertical",
    display: "-webkit-box",
    fontSize: 14,
    lineHeight: "18px",
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      height: 36,
      lineClamp: 2,
    },
    [theme.breakpoints.up("md")]: {
      height: 18,
      lineClamp: 1,
    },
  },
}));

const ProductCard = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();


  // メニューアイコンの実装
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
  // 実行によってanchorELには商品情報がはいる
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
 
  const images = props.images.length > 0 ? props.images : [NoImage];
  const price = props.price.toLocaleString();
  return (
    <Card className={classes.root}>
      {/* 商品一覧の画像部分 */}
      <CardMedia
        className={classes.media}
        image={images[0].path}
        // 画像クリック時idのURLに遷移
        onClick={() => dispatch(push("/product/edit/" + props.id))}
      />
      {/* 商品一覧の文字部分  */}
      <CardContent className={classes.content}>
        <div onClick={() => dispatch(push("/product/edit/" + props.id))}>
          <Typography color="textSecondary" component="p">
            {props.name}
          </Typography>
          <Typography component="p" className={classes.price}>
            ¥{price}
          </Typography>
        </div>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          // ブーリアン型で初期値nullに対し何らかの値があればtrue
          open={Boolean(anchorEl)}
          // onCloseはここ以外がクリックされた時に発火する
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              dispatch(push("/product/edit/" + props.id))
              handleClose()
            }}
          >
            編集する
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatch(deleteProduct(props.id))
              handleClose()
            }}
          >
            削除する
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
