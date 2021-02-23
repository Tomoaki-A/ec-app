import { FirebaseTimestamp,db} from "../../firebase"
import {push} from 'connected-react-router'

const productsRef = db.collection('products')

export const saveProduct = (name,description,category,gender,price,images) => {
  return async (dispatch) => {
    const timeStamp = FirebaseTimestamp.now()

    const data = {
      category: category,
      description: description,
      gender: gender,
      images: images,
      name: name,
      price: parseInt(price,10),
      updated_at: timeStamp,
    }

    const ref = productsRef.doc()
    const id = ref.id
    data.id = id
    data.create_at = timeStamp

    return productsRef.doc().set(data)
    .then(() => {
      dispatch(push('/'))
    }).catch((error) => {
      throw new Error(error)
    })
  }
}