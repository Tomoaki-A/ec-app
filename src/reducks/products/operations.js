import { FirebaseTimestamp, db } from "../../firebase";
import { push } from "connected-react-router";
import { fetchProductsAction, deleteProductAction } from "./actions";

const productsRef = db.collection("products");

// 引数idのデータをfirebaseから削除する
export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    // idのデータをfirebaseから削除し
    productsRef
      .doc(id)
      .delete()
      .then(() => {
        // storeのproductsの状態を取得し
        const prevProducts = getState().products.list;
        // products全てのstateから該当id以外を抜き出しactionへ
        const nextProducts = prevProducts.filter(
          (product) => product.id !== id
        );
        dispatch(deleteProductAction(nextProducts));
      });
  };
};

// firebaseのproductのデータを取り出しローカルのstoreに保存する
export const fetchProducts = (gender,category) => {
  return async (dispatch) => {

    // とりあえずFirebaseから全ての商品情報を取得
let query = productsRef.orderBy("updated_at", "desc")
// もし引数のgenderに文字が入ってれば商品情報のgenderが引数genderと一致するもののみを抽出し変数queryを書き換える
query = (gender !== '') ? query.where('gender', '==', gender) : query;
query = (category !== '') ? query.where('category', '==', category) : query;

    // productのデータをgetし
    query.get()
      .then((snapshots) => {
        const productList = [];
        snapshots.forEach((snapshot) => {
          const product = snapshot.data();
          // 結果を1つずつproductList配列に入れる
          productList.push(product);
        });
        // actionへdispatchしstoreへ保存
        dispatch(fetchProductsAction(productList));
      });
  };
};

// トランザクション
export const orderProduct = (productsInCart, amount) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const userRef = db.collection("users").doc(uid);
    const timestamp = FirebaseTimestamp.now();

    //
    let products = [],
      soldOutProducts = [];

    const batch = db.batch();

    //  引数で受け取ったprpductsInCartを定数productに入れていく
    for (const product of productsInCart) {
      //  商品のproductIdからその商品の情報をFirebaseから取得
      const snapshot = await productsRef.doc(product.productId).get();

      //  今(注文完了前)の在庫状況を知りたいのので取得(sizesにはsizeとquantyがある)
      const sizes = snapshot.data().sizes;

      //  在庫更新のため注文完了後のsizesの配列を作る
      const updateSizes = sizes.map((size) => {
        //  その商品に存在するサイズが購入されたサイズ(SとかM)と同じなら在庫量を-1する
        if (size.size === product.size) {
          //  そもそも既に売切れてたら上で定義押したsoldOutProducts配列にpush
          if (size.quantity === 0) {
            soldOutProducts.push(product.name);
            return size;
          }
          return {
            size: size.size,
            quantity: size.quantity - 1,
          };
          //  違ったらそのままのsizeを返す
        } else {
          return size;
        }
      });

      //  注文履歴用の商品データ
      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size,
      });

      //  商品情報のsize(主にquantity)を注文後のFirebaseデータに書き換えるバッチ処理
      batch.update(productsRef.doc(product.productId), { sizes: updateSizes });
      // カートを空にするバッチ処理
      batch.delete(userRef.collection("cart").doc(product.cartId));
    }

    // 注文しようとした商品に売切れがあればエラーメッセージを出しトランザクション中止
    if (soldOutProducts.length > 0) {
      const errorMessage =
        soldOutProducts.length > 1
          ? soldOutProducts.join("と")
          : soldOutProducts[0];
      alert(
        "大変申し訳ありません。" +
          errorMessage +
          "が在庫切れとなったため注文処理を中断しました"
      );
      return false;
      // バッチ処理をコミット
    } else {
      batch
        .commit()
        // バッチ処理が成功した際の処理
        .then(() => {
          // Firebaseのusersの中に新しくordersというコレクションを作る
          const orderRef = userRef.collection("orders").doc();
          // 配送日を作るために今日の日付を取得
          const date = timestamp.toDate();
          // 今日の日付に3足したものをFirebaseの日付として定義する
          const shippingDate = FirebaseTimestamp.fromDate(
            new Date(date.setDate(date.getDate() + 3))
          );
            // 注文履歴として保存するデータを定数化
          const history = {
            amount: amount,
            createed_at: timestamp,
            id: orderRef.id,
            products: products,
            shipping_date: shippingDate,
            updated_at: timestamp,
          };
          // Firebaseのordersにデータをセット
          orderRef.set(history);

          dispatch(push("/order/complete"));
        })
        .catch(() => {
          alert(
            "注文処理に失敗しました。通信環境をご確認のうえ、もう一度お試しください。"
          );
          return false;
        });
    }
  };
};

// ProductEditコンポーネント(商品情報作成)の"登録する"ボタンにより発火
// それぞれの引数を受け取り
export const saveProduct = (
  id,
  name,
  description,
  category,
  gender,
  price,
  sizes,
  images
) => {
  return async (dispatch) => {
    // タイムスタンプを定義
    const timeStamp = FirebaseTimestamp.now();
    // 引数の値をdataとして定義
    console.log(images);
    const data = {
      category: category,
      description: description,
      gender: gender,
      images: images,
      name: name,
      price: parseInt(price, 10),
      sizes: sizes,
      updated_at: timeStamp,
    };
    console.log(data);
    // もし新規作成なら(idがなかったら) add()を使わないパターン
    if (id === "") {
      // データベースのproductに対してdoc()でidを採番して定義
      const ref = productsRef.doc();
      // 採番したidをconst data に追加
      id = ref.id;
      data.id = id;
      data.create_at = timeStamp;
    }

    // set()は全てを更新してしまうので、第２引数に{marge:true}とすることで変更部分のみをset()で変更する
    return productsRef
      .doc(id)
      .set(data, { merge: true })
      .then(() => {
        dispatch(push("/"));
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

