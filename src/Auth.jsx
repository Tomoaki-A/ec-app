import React, { useEffect } from "react";
import { getIsSignedIn } from "./reducks/users/selectors";
import { useDispatch, useSelector } from "react-redux";
import { listenAuthState } from "./reducks/users/opeations";

const Auth = ({ children }) => {
  const dispatch = useDispatch();
  // storeから全stateを取得
  const selector = useSelector((state) => state);
  //selectores.jsで定義したgetIsSignedIn()によって現在サインインしているか否か確認
  const isSignedIn = getIsSignedIn(selector);

  // hooksのuseEffectはclassコンポーネントでのライフサイクルメソッドにあたる(componentDidMount)
  useEffect(() => {
    // もしサインインしていなければ
    // operationsに記述したサインインをリッスンする処理へ飛ばす
    if (!isSignedIn) {
      // reduxの関数なのでdispatchで呼び出し
      dispatch(listenAuthState());
    }
  }, []);

  if (!isSignedIn) {
    // もしサインインしていなければ、空のJSXを返し
    return <></>;
  } else {
    // サインインしてれば、受け取った子要素を返す
    // 今回の子要素とはRouterでの１つ下階層、Homeコンポーネント表示
    return children;
  }
};

export default Auth;
