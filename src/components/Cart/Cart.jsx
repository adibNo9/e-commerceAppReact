import React from 'react';
import { Container,  Typography, Button, Grid } from '@material-ui/core';
import useStyles from './styles';
import CartItem from './CartItem/CartItem';
import { Link } from 'react-router-dom';

const Cart = ({ cart, updateCartQtyHandler, removeFromCartHandler, emptyCartHandler }) => {
  const classes = useStyles();

  if(!cart.line_items) return 'Loading...';

  const isEmpty = !cart.line_items.length;
  

  const EmptyCart = () => (
     <Typography variant="subtitle1">You have no item in your Shopping Cart,
     <Link to='/' className={classes.link}>start adding some!</Link>
     </Typography>
  )

  const FilledCart = () => (
      <>
      <Grid container spacing={3} >
        {cart.line_items.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <CartItem item={item} onRemoveFromCart={removeFromCartHandler} onUpdateCartQty={updateCartQtyHandler}  />
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
          <Typography variant="h4">
            subtotal: {cart.subtotal.formatted_with_symbol}
          </Typography>
          <div>
            <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={emptyCartHandler}>Empty Cart</Button>
            <Button component={Link} to="/checkout"  className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary" >Checkout</Button>
          </div>
      </div>
    </>
  )

  
  return (
    <Container>
      <div className={classes.toolbar}/>
      <Typography className={classes.title} variant="h4" gutterBottom >
        Your Shopping Cart
      </Typography>
      {isEmpty ? <EmptyCart /> : <FilledCart />}
    </Container>
  )
}

export default Cart;