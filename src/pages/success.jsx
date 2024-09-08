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
    console.log('Query parameters:', sessionId, orderId); // Add this log

    const updatePaymentStatus = async () => {
      if (!sessionId || !orderId) {
        console.error('Missing sessionId or orderId'); // This message will appear if either is missing
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:5000/order/update-payment/${orderId}`,
          {
            paymentStatus: 'paid',
          }
        );
        toast.success('Order updated successfully');
      } catch (error) {
        console.error('Error updating payment status:', error);
        toast.error('Failed to update order');
      }
    };

    updatePaymentStatus(); // Call function to update payment
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
