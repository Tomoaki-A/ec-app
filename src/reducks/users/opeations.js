import { signInAction, signOutAction } from "./actions";
import { push } from "connected-react-router";
import { auth, db, FirebaseTimestamp } from "../../firebase/index";

// リッスン
export const listenAuthState = () => {
  // redux-thunkの基本形
  return async (dispatch) => {
    // りた〜ん
    return auth.onAuthStateChanged((user) => {
      // userが存在していたら(userが認証完了されていたら)
      if (user) {
        // サインイン時と同じ処理
        const uid = user.uid;
        db.collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            const data = snapshot.data();
            dispatch(
              signInAction({
                isSignedIn: true,
                role: data.role,
                uid: uid,
                username: data.username,
              })
            );
          });
          // userが存在していなかったら(userが認証完了したいなかったら)
      } else {
        // サインイン画面へ飛ばす
        dispatch(push("/signin"));
      }
    });
  };
};

// パスワードリセット
export const resetPassword = (email) => {
  return async (dispatch) => {
    if (email === "") {
      alert("必須項目が未入力です")
      return false
    } else {
      // Firebaseのパスワードリセットのメソッド
      auth.sendPasswordResetEmail(email)
      .then(() => {
        alert('入力されたアドレスにパスワードリセット用のメールをお送りしました。')
        dispatch(push('/signin'))
      // もし失敗したら
      }).catch(() => {
        alert('パスワードリセットに失敗しました。通信環境を確認してください。')
      })
    }
  }
}

// サインイン
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
// サインアップ
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

// サインアウト
export const signOut = () => {
  return async (dispatch) => {
    // firebaseのsignOutメソッドを呼び出し (firebase的にサインアウト)
    auth.signOut().then(() => {
      // reduxのsignOutActionメソッドを呼び出し (Reduxの状態管理的にもサインアウト)
      dispatch(signOutAction());
      // サインイン画面に推移
      dispatch(push("/signin"));
    });
  };
};
