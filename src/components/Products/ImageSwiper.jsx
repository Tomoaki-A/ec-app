import React, { useState } from 'react'
import Swiper from "react-id-swiper"
import NoImage from "../../assets/img/src/no_image.png"
import 'swiper/css/swiper.css'

const ImageSwiper = (props) => {

  // Swiperで使用するパラメータを設定
  const [params] = useState({
    pagination: {
      el: ".swiper-pagination",
       // 画像の下の丸ポチ
      type: "bullets",
      // trueで丸ポチクリックで切り替え可能
      clickable: true,
    //  丸ポチの表示してるやつは大きくなる
      dynamicBullets: true
    },
    navigation: {
      // 次へボタン
      nextEl: ".swiper-button-next",
      // 前へボタン
      prevEl: ".swiper-button-prev"
    },
    // ループする
    loop: true
  });

const images = props.images

return(
  // Swiperに上で設定したパラメータを指定
  <Swiper {...params}>
    {images.length ===0 ? (
      <div className="p-media__thumb">
        <img src={NoImage} alt="no image" />
      </div>
    ): (
      // propsで受け取ったimagesの数だけ表示
      images.map(image => (
        <div className="p-media__thumb">
           <img src={image.path} alt="商品画像" />
        </div>
      ))
    )
  }
  </Swiper>
)}

export default ImageSwiper;