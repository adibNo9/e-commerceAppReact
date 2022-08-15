import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import logo from '../../assets/Icona-Gestione-e-commerce (1).png'; 
import useStyle from './styles';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ totalItems }) => {
  const classes = useStyle();
  const location = useLocation();

  return (
    <>
      <AppBar position='fixed' className={classes.appBar} color='inherit'>
        <Toolbar>
          <Typography component={Link} to="/" variant='h6' className={classes.title} color='inherit'>
            <img src={logo} alt='commerce.js' height='25px' className={classes.image} />
            Commerce.js
          </Typography>
          <div className={classes.grow} />
          {location.pathname === '/' &&  <div>
            <IconButton component={Link} to="/cart" aria-label='Show cart items' color='inherit'>
              <Badge overlap="rectangular" badgeContent={totalItems} color='secondary'>
                <ShoppingCart />
              </Badge>
            </IconButton>
          </div>}
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Navbar;