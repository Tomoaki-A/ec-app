import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import {firebaseConfig} from './config'

//firebaseConfig(設定)を使って初期化しますよの処理
firebase.initializeApp(firebaseConfig)
// firebaseのメソッドはよく使うから定数化してexportすることによって記述量を減らす
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.functions();
export const FirebaseTimestamp = firebase.firestore.Timestamp;