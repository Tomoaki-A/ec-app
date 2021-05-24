import { FirebaseTimestamp, db } from "../../firebase";
import { push } from "connected-react-router";

const productsRef = db.collection("products");

// ProductEditコンポーネント(商品情報作成)の"登録する"ボタンにより発火
// それぞれの引数を受け取り
export const saveProduct = (id, name, description, category, gender, price, sizes, images) => {
 
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
      .set(data, { marge: true })
      .then(() => {
        dispatch(push("/"));
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

