import React, { useCallback } from "react";
import IconButton from "@material-ui/core/IconButton";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { makeStyles } from "@material-ui/styles";
import { storage } from "../../firebase/index";
import ImagePreview from "./ImagePreview";

const useStyles = makeStyles({
  icon: {
    height: 48,
    width: 48,
  },
});

const ImageArea = (props) => {
  const classes = useStyles();

  // 画像を消去するuseコールバック関数
  const deleteImage = useCallback(
    async (id) => {
      const ret = window.confirm("この画像を削除しますか？");
      if (!ret) {
        return false;
      } else {
        // 指定したid以外のimageを抽出し
        const newImages = props.images.filter((image) => image.id !== id);
        // stateを更新
        props.setImages(newImages);
        // firebaseのストレージから削除
        return storage.ref("images").child(id).delete();
      }
    },
    [props.images]
  );

  // 画像をアップロードするuseコールバック関数
  const uploadImage = useCallback(
    (e) => {
      // 選択された画像ファイルファイル
      const file = e.target.files;
      // そのままではCloud Storageにアップできないので一旦blob()で置き換える
      let blob = new Blob(file, { type: "image/jpeg" });

      // ファイル名をランダムな16桁の文字列で作る
      // 文字列生成に使う文字を指定
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      // 桁数を指定
      const N = 16;
      const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");

      // ストレージにて、ref('images')でimagesというディレクトリに.child(fikeName)でファイル名を指定
      const uploadRef = storage.ref("images").child(fileName);
      // 実際にアップロードするにはputメソッドを使う
      const uploadTask = uploadRef.put(blob);
      uploadTask.then(() => {
        // アップロードした画像のダウンロードできるURLを取得
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          // ローカル上のstateを変更するためにidとpathをnewImageに格納
          const newImage = { id: fileName, path: downloadURL };
          console.log(newImage);
          // 前までのstateをスプレッド構文で展開し、newImageを追加する(これをしないと２枚目以降、画像変更のみで追加されない)
          props.setImages((prevState) => [...prevState, newImage]);
        });
      });
    },
    [props.setImages]
  );

  return (
    <div>
      <div className="p-grid__list-images">
      {props.images.length > 0 && (
        props.images.map(image => <ImagePreview id={image.id} path={image.path} key={image.id}/>)
      )}
        
      </div>
      <div className="u-text-right">
        <span>商品画像を登録する</span>
        <IconButton>
          <label>
            <AddAPhotoIcon className={classes.icon} />
            <input
              className="u-display-none"
              type="file"
              id="image"
              onChange={(e) => uploadImage(e)}
            />
          </label>
        </IconButton>
      </div>
    </div>
  );
};

export default ImageArea;
