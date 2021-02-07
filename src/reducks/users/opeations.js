import { signInAction } from "./actions";
import { push } from "connected-react-router";
import { auth, db, FirebaseTimestamp } from "../../firebase/index";

export const signIn = (email, password) => {
  // redux-thunkのお決まりの形
  return async (dispatch) => {
    // Validation 入力された値のフォーマットが正しいか検証しアラートを出す
    if (email === "" || password === "") {
      alert("必須項目が未入力です");
      return false;
    }

    // りた〜ん
    // Firebaseでサインインするメソッド
    auth.signInWithEmailAndPassword(email, password).then((result) => {
      const user = result.user;
      // 成功してればresultの中にuserがあるはずなので定数化してif文(もしuserが存在したら)
      if (user) {
        const uid = user.uid;
        db.collection("users")
          // ドキュメントのuidで
          .doc(uid)
          // データを取得
          .get()
          // ２つが終わると取得したデータをconst dataに入れる
          .then((snapshot) => {
            const data = snapshot.data();

            // signInActionにデータを渡して実行
            dispatch(
              signInAction({
                isSignedIn: true,
                role: data.role,
                uid: uid,
                username: data.username,
              })
            );

            dispatch(push("/"));
          });
      }
    });
  };
};

export const signUp = (username, email, password, confirmPassword) => {
  // redux-thunkのお決まりの形
  return async (dispatch) => {
    // Validation 入力された値のフォーマットが正しいか検証しアラートを出す
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("必須項目が未入力です");
      return false;
    }
    if (password !== confirmPassword) {
      alert("パスワードが一致しません");
      return false;
    }

    // りた〜ん
    // Firebaseで設定したauthのユーザーを作るメソッド
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user;
        //  成功してればresultの中にuserがあるはずなので定数化してif文(もしuserが存在したら)
        if (user) {
          const uid = user.uid;
          // 現在のサーバー時刻を取得してタイムスタンプ化
          const timestamp = FirebaseTimestamp.now();

          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "customer",
            uid: uid,
            updated_at: timestamp,
            username: username,
          };
          // 上で定義した定数をfirebaseのcloud firestore(データベース)に登録する処理
          db.collection("users")
            // ドキュメントにuid
            .doc(uid)
            // コレクションにセット
            .set(userInitialData)
            // 上２つが成功したらdispatchでpush
            .then(() => {
              dispatch(push("/"));
            });
        }
      });
  };
};
