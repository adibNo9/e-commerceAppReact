import React, { useState, useEffect, useCallback } from 'react';

import { commerce } from './lib/commerce';
import Products from './components/products/Products';
import Navbar from './components/Navbar/Navbar';
import Cart from './components/Cart/Cart';
import Checkout from './components/CheckourForm/Checkout/Checkout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();

    setProducts(data);
  };

  const fetchCart = async () => {
    const res = await commerce.cart.retrieve();

    setCart(res);
  };

  const addToCartHandler = useCallback(async (productId, quantity) => {
    const res = await commerce.cart.add(productId, quantity);

    setCart(res);
  }, []);

  const updateCartQtyHandler = async (productId, quantity) => {
    const res = await commerce.cart.update(productId, { quantity });

    setCart(res);
  };

  const removeFromCartHandler = useCallback(async (productId) => {
    const res = await commerce.cart.remove(productId);

    setCart(res);
  }, []);

  const emptyCartHandler = async () => {
    const res = await commerce.cart.empty();

    setCart(res);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  const captureCheckoutHandler = async (checkoutTokenId, newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(
        checkoutTokenId,
        newOrder
      );

      setOrder(incomingOrder);
      refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, [addToCartHandler]);

  if (!cart) {
    return (
      <CircularProgress
        style={{
          display: 'flex',
          margin: 'auto',
          alignItems: 'center',
          height: '90vh',
        }}
      />
    );
  }

  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Routes>
          <Route
            path="/"
            element={
              <Products products={products} onAddToCart={addToCartHandler} />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                updateCartQtyHandler={updateCartQtyHandler}
                removeFromCartHandler={removeFromCartHandler}
                emptyCartHandler={emptyCartHandler}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                order={order}
                captureCheckoutHandler={captureCheckoutHandler}
                error={errorMessage}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
