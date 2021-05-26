
import { createSelector } from "reselect";

// 全てのstateからproductsに関するstateだけ抜き出し
const productsSelector = (state) => state.products;

export const getProducts = createSelector(
    [productsSelector],
    // productsのListに関するstateだけ返す
    state => state.list
);