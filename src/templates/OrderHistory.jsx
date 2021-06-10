import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/styles";
import { getOrdersHistory } from "../reducks/users/selectors";
import { fetchOrdersHistory } from "../reducks/users/opeations";
import OrderHistoryItem from "../components/Products/OrderHistoryItem";
const useStyles = makeStyles((theme) => ({
  orderList: {
    background: theme.palette.grey["100"],
    margin: "0 auto",
    padding: 32,
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.up("md")]: {
      width: 768,
    },
  },
}));

const OrderHistory = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
  const orders = getOrdersHistory(selector);

  // DidMountと同義、
  useEffect(() => {
    dispatch(fetchOrdersHistory());
  }, []);


  return (
    <section className="c-section-wrapin">
      <List className={classes.orderList}>
        {/* 注文履歴の数だけコンポーネントを表示 */}
        {orders.length > 0 &&
          orders.map((order) => (
            <OrderHistoryItem key={order.id} order={order} />
          ))}
      </List>
    </section>
  );
};

export default OrderHistory;
