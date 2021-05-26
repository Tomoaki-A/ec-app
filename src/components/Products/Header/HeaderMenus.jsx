import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FacoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import MenuIcon from "@material-ui/icons/Menu";


const HeaderMenus = () => {

  return(
     <>
    <IconButton>
      <Badge badgeContent={1} color='secondary'>
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
    <IconButton>
      <FacoriteBorderIcon />
    </IconButton>
    <IconButton>
      <MenuIcon />
    </IconButton>
  </>
  )
 
};

export default HeaderMenus;
