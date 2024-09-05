import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, Link } from 'react-router-dom';

import { Container, Typography, Button, Paper } from '@mui/material';

const Success = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const sessionId = query.get('session_id');
  const orderId = query.get('orderId');

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        // Send POST request to update payment status to 'paid'
        await axios.post(`https://gateguard-backend.onrender.com/order/update-payment/${orderId}`, {
          paymentStatus: 'paid',
        });
        // Optionally redirect or show a success message
        toast.success('Order updated successfully');
      } catch (error) {
        console.error('Error updating payment status:', error);
        // Handle the error
      }
    };

    if (sessionId && orderId) {
      updatePaymentStatus();
    }

    updatePaymentStatus();
  }, [sessionId, orderId]);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="h6" paragraph>
          Thank you for your payment. Your transaction was completed successfully.
        </Typography>
        <Typography variant="body1" paragraph>
          Your order has been placed.
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/">
          Return to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default Success;
