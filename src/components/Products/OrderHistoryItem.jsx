import React from 'react'
import Divider from '@material-ui/core/Divider'
import {TextDetail} from '../UIkit'
import {OrderedProducts} from './index'

// toDateFirebaseのタイムスタンプを日付っぽく変換する関数
const datetimeToString = (date) => {
  return date.getFullYear() + '-' 
  + ('00' + (date.getMonth() +1)).slice(-2) 
  + '-' + ('00' + date.getDate()).slice(-2)
  + ' ' + ('00' + date.getHours()).slice(-2)
  + ':' + ('00' + date.getMinutes()).slice(-2)
  + ':' + ('00' + date.getSeconds()).slice(-2)
}

const dateToString = (date) => {
  return date.getFullYear() + '-' 
  + ('00' + (date.getMonth() +1)).slice(-2) 
  + '-' + ('00' + date.getDate()).slice(-2)
}


const OrderHistoryItem = (props) => {
const order = props.order;
const price = '¥' + order.amount.toLocaleString();
const orderedDateTime = datetimeToString(order.updated_at.toDate())
const shippingDate = dateToString(order.shipping_date.toDate())

console.log(orderedDateTime);

  return(
    <div>
      <div className='module-spacer--small'/>
      <TextDetail label={'注文ID'} value={order.id}/>
      <TextDetail label={'注文日時'} value={orderedDateTime}/>
      <TextDetail label={'発送予定日'} value={shippingDate}/>
      <TextDetail label={'注文金額'} value={price}/>
      {/* 注文履歴に商品情報が１件でもあれば */}
      {order.products.length > 0 && (
        <OrderedProducts products={order.products}/>
      )}
      <div className='module-spacer--extra-extra-small'/>
      <Divider/>
    </div>
  )
}

export default OrderHistoryItem