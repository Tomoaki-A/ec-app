import {React,useState, useCallback} from "react";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useSelector, useDispatch } from "react-redux";
import { getIsSignedIn } from "../../../reducks/users/selectors";
import { push  } from "connected-react-router";

import { HeaderMenus, ClosableDrawer } from "./index";


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  menuBar: {
    backgroundColor: "#fff",
    color: "fff",
  },
  toolBar: {
    margin: "0 auto",
    maxWidth: 1024,
    width: "100%",
  },
  iconButtoms: {
    margin: "0 0 0 auto",
  },
});

const Header = () => {
  const classes = useStyles();
  const selector = useSelector((state) => state);
  const isSignedIn = getIsSignedIn(selector);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  // ハンバーガーメニューの開閉を統括する関数
  const handleDrawerToggle = useCallback((event)=>{
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")){
      return;
    }
    setOpen(!open)
  },[setOpen,open])

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.menuBar}>
        <Toolbar className={classes.toolBar}>
          <div onClick={() => dispatch(push("/"))}>Home</div>
          {/* isSignedInがtrueなら,表示 */}
          {isSignedIn && (
            <div className={classes.iconButtoms}>
              <HeaderMenus handleDrawerToggle={handleDrawerToggle}/>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <ClosableDrawer
      open={open}
      onClose={handleDrawerToggle}
      />
    </div>
  );
};

export default Header;
