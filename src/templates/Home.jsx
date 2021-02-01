import React from 'react'
import { useSelector } from 'react-redux'
import {getUserId, getUsername} from '../reducks/users/selectors'


const Home = () => {

const selector = useSelector(state => state)
const uid = getUserId(selector)
const username = getUsername(selector)
  return(
    <div>
       <h2>HOME</h2>
       <p>ユーザーID：{uid}</p>
       <p>ユーザー名：{username}</p>
    </div>
   
  )
}

export default Home