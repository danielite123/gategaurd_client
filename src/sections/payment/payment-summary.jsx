import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function PaymentSummary(props) {
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

      <Button fullWidth size="large" variant="contained" sx={{ mt: 5, mb: 3 }}>
        Order
      </Button>
    </Box>
  );
}

PaymentSummary.propTypes = {
  sx: PropTypes.object,
};
