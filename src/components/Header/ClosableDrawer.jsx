import React , {useState, useCallback}from 'react'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import {makeStyles} from '@material-ui/styles'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import HistoryIcon from '@material-ui/icons/History'
import PersonIcon from '@material-ui/icons/Person'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import {TextInput} from '../UIkit/index'
import {useDispatch} from 'react-redux'
import {push} from 'connected-react-router'

import {signOut} from '../../reducks/users/opeations'


const useStyles = makeStyles((theme) => ({
  drawer: {
     [theme.breakpoints.up('sm')]:{
    width: 256,
    flexShrink: 0,
  }},
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 256,
  },
  searchField: {
    alignItems: "center",
    display: "flex",
    marginLeft: 32
  }
}));


const ClosableDrawer = (props) => {
  const classes = useStyles()
  const {container} = props
  const dispatch = useDispatch() 

  const [keyword, setKeyword] = useState('')

  // textInputの値をstateとして保持するための関数
  const inputKeyword = useCallback((event) => {
    setKeyword(event.target.value)
  },[setKeyword])

  // 引数で受け取ったpathのURLへ飛ぶ&メニューを閉じる関数
  const selectMenu = (event,path) => {
    dispatch(push(path))
    props.onClose(event)
  }
// ログアウトのonClickはoperationsのサインアウトとメニューを閉じる2つを実行するため書き出し
  const logOutonClick = (event) => {
    props.onClose(event)
    dispatch(signOut())
  }

  // メニューで表示する情報を定義
  const menus = [
    {
      func: selectMenu,
      label: '商品登録',
      icon: <AddCircleIcon/>,
      id: 'register',
      value: '/product/edit'
    },
    {
      func: selectMenu,
      label: '注文履歴',
      icon: <HistoryIcon/>,
      id: 'history',
      value: '/order/history'
    },
    {
      func: selectMenu,
      label: 'プロフィール',
      icon: <PersonIcon/>,
      id: 'profile',
      value: '/user/mypage'
    }
  ]

  return(
    <nav className={classes.drawer}>
      <Drawer
        container={container}
        variant='temporary'
        anchor='right'
        open={props.open}
        onClose={(event) => props.onClose(event)}
        classes={{paper: classes.drawerPaper}}
        ModalProps={{keyMounter: true}}
      >
        <div
          onClose={(event) => props.onClose(event)}
          onKeyDown={(event) => props.onClose(event)}
        >
          <div className={classes.searchField}>
                <TextInput 
                fullWidth={false}
                label={'キーワードを入力'}
                multiline={false}
                onChange={inputKeyword}
                required={false}
                value={keyword}
                type={'text'}
                />
                <IconButton>
                  <SearchIcon/>
                </IconButton>
          </div>
          <Divider/>
          <List>
            {/* メニューの内容 */}
            {menus.map(menu => (
              <ListItem button key={menu.id} onClick={(e)=> menu.func(e,menu.value)}>
                <ListItemIcon>
                  {menu.icon}
                </ListItemIcon>
                <ListItemText primary={menu.label}/>
              </ListItem>
            ))}
            {/* operationsのサインアウトする処理へ飛ばす */}
            <ListItem button key='logout' onClick={logOutonClick}
            >
              <ListItemIcon>
                <ExitToAppIcon/>
              </ListItemIcon>
              <ListItemText primary={'Logout'}/>
            </ListItem>
          </List>
        </div>

      </Drawer>
    </nav>
  )
}

export default ClosableDrawer