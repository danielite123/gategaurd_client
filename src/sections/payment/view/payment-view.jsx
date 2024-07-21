import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

import PaymentMethods from '../payment-methods';

const stripePromise = loadStripe(
  'pk_test_51PeJ6YECc33s4wLhAAcB2cL1CpUNFUzIRRdwLQakMo81Ua4KV4WgMqxg4FFwEyvzKSq0Cfbjpk8RF4smH4j7kw0U00UqgsjGzv'
);

// ----------------------------------------------------------------------

const CheckoutForm = ({ order }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: email,
      },
    });

    if (error) {
      console.error('Error creating payment method:', error);
    } else {
      try {
        const response = await axios.post('https://gateguard-backend.onrender.com/order/payment', {
          amount: order.price, // Pass the amount to the backend
          payment_method_id: paymentMethod.id,
        });

        if (response.data.error) {
          console.error('Payment failed:', response.data.error);
          toast.error('Payment failed');
        } else {
          console.log('Payment successful:', response.data);
          navigate('/');
          toast.success('Payment successful');
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('Failed to process payment. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3} mt={5}>
        <TextField
          fullWidth
          label="Account Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CardElement />
      </Stack>
      <Button type="submit" fullWidth size="large" variant="contained" sx={{ mt: 5, mb: 3 }}>
        Order
      </Button>
    </form>
  );
};

export default function PaymentView(props) {
  const { sx, ...other } = props;
  const [order, setOrder] = useState(null);
  const orderId = new URLSearchParams(window.location.search).get('orderId'); // Get orderId from URL

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const token = localStorage.getItem('token');

          const response = await axios.get(
            `https://gateguard-backend.onrender.com/order/get-order/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setOrder(response.data);
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      };

      fetchOrderDetails();
    }
  }, [orderId]);

  if (!order) return <Typography>Loading...</Typography>;

  return (
    <Elements stripe={stripePromise}>
      <Container
        sx={{
          pt: 15,
          pb: 10,
          minHeight: 1,
        }}
      >
        <Typography variant="h3" align="center" sx={{ mb: 2 }}>
          Payment
        </Typography>

        <Grid container rowSpacing={{ xs: 5, md: 0 }} columnSpacing={{ xs: 0, md: 5 }}>
          <Grid xs={12} md={8}>
            <Box
              gap={5}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
              sx={{
                p: { md: 5 },
                borderRadius: 2,
                border: (theme) => ({
                  md: `dashed 1px ${theme.palette.divider}`,
                }),
              }}
            >
              <div>
                <Typography variant="h6">Billing Address</Typography>

                <CheckoutForm order={order} />
              </div>

              <PaymentMethods />
            </Box>
          </Grid>

          <Grid xs={12} md={4}>
            <Box
              sx={{
                p: 5,
                borderRadius: 2,
                bgcolor: 'background.neutral',
                ...sx,
              }}
              {...other}
            >
              <Typography variant="h6" sx={{ mb: 5 }}>
                Summary
              </Typography>

              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    From
                  </Typography>
                  <Label color="success">{order.from}</Label>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    To
                  </Typography>
                  <Label color="success">{order.to}</Label>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Distance
                  </Typography>
                  <Label color="success">{order.distance}</Label>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Duration
                  </Typography>
                  <Label color="success">{order.duration}</Label>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">Total Billed</Typography>
                  <Typography variant="subtitle1"># {order.price}</Typography>{' '}
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Elements>
  );
}

PaymentView.propTypes = {
  sx: PropTypes.object,
};
