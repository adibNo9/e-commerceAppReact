import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


import Review from './Review';

const stripePromise = loadStripe( '...' );

const PaymentForm = ({checkoutToken, shippingData, backStep, captureCheckoutHandler, nextStep, timeout}) => {
  const submitHandler = async (e, elements, stripe) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElemet = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({type: 'card', card: cardElemet})
  
    if (error) {
      console.log(error);
      return <p>error</p>;
    } else {
      const orderData = {
          line_items: checkoutToken.line_items,
          customer: { firstname: shippingData.firstname, lastname: shippingData.lastname, email: shippingData.email},
          shipping: { 
            name: 'Primary', 
            street: shippingData.address1, 
            town_city: shippingData.city, 
            county_state: shippingData.shippingSubdivision,
            postal_zip_code: shippingData.zip,
            country: shippingData.shippingCountry
          },
          fulfillment: { shipping_method: shippingData.shippingOption },
          payment: {
            gateway: 'stripe',
            stripe: {
              payment_method_id: paymentMethod.id,
            }
        } 
      }

      captureCheckoutHandler(checkoutToken.id, orderData);
      timeout(

      )

      nextStep();
    }
  }

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant='h6' gutterBottom style={{margin: '20px 0'}}>Payment method</Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({elements, stripe}) => (
            <form onSubmit={submitHandler}>
              <CardElement /> 
              <br /> <br />
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant='outlined' onClick={backStep}>Back</Button>
                <Button variant='contained' color='primary' type='submit' disabled={!stripe} onClick={backStep}>
                  Pay {checkoutToken.subtotal.formatted_with_symbol}
                  </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  )
}

export default PaymentForm;