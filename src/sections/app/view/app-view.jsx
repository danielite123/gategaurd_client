import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import Label from 'src/components/label';

export default function AppView(props) {
  const { sx, ...other } = props;
  const [routes, setRoutes] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const stripePromise = loadStripe(
    'pk_test_51PeJ6YECc33s4wLhAAcB2cL1CpUNFUzIRRdwLQakMo81Ua4KV4WgMqxg4FFwEyvzKSq0Cfbjpk8RF4smH4j7kw0U00UqgsjGzv'
  );

  useEffect(() => {
    // Fetch routes from backend
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('https://gateguard-backend.onrender.com/routes');
        if (response.data.success) {
          setRoutes(response.data.routes);
        } else {
          toast.error('Failed to fetch routes');
        }
      } catch (error) {
        toast.error('Error fetching routes');
      }
    };

    fetchRoutes();
  }, []);

  const handleCalculateRoutes = async () => {
    if (from && to) {
      try {
        const response = await axios.post(
          'https://gateguard-backend.onrender.com/routes/calculate-route',
          {
            from,
            to,
          }
        );

        if (response.data.success) {
          const { distance, duration, price } = response.data;

          setDistance(distance);
          setDuration(duration);
          setPrice(price);

          toast.success('Success');

          //
        } else {
          toast.error(response.data.message || 'Error calculating route');
        }
      } catch (error) {
        toast.error('Route not found');
      }
    } else {
      toast.error('Please select both "From" and "To" locations');
    }
  };

  const handlePlaceTrip = async () => {
    setLoading(true);
    if (price) {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.post(
          'https://gateguard-backend.onrender.com/order/create-order',
          {
            from,
            to,
            distance,
            duration,
            price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.sessionId) {
          const stripe = await stripePromise;
          await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
        } else {
          toast.error('Error creating checkout session');
        }
      } catch (error) {
        toast.error('Error placing trip');
      }
    } else {
      toast.error('Price is not available');
    }
  };

  const handleFromChange = (event, newValue) => {
    setFrom(newValue);
    setDistance(null); // Clear distance
    setDuration(null); // Clear duration
    setPrice(null); // Clear price
  };

  const handleToChange = (event, newValue) => {
    setTo(newValue);
    setDistance(null); // Clear distance
    setDuration(null); // Clear duration
    setPrice(null); // Clear price
  };

  return (
    <Container sx={{ minHeight: 1 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container rowSpacing={{ xs: 5, md: 0 }} columnSpacing={{ xs: 0, md: 5 }}>
        <Grid xs={12} md={8}>
          <Box
            sx={{
              borderRadius: 2,
              bgcolor: 'background.neutral',
              ...sx,
              background: 'url("/assets/urban-city.png") no-repeat center center',
              backgroundSize: 'cover',
              height: '100%',
            }}
            {...other}
          />
        </Grid>

        <Grid
          xs={12}
          md={4}
          sx={{
            p: { md: 2 },
            borderRadius: 2,
            border: (theme) => ({
              md: `dashed 1px ${theme.palette.divider}`,
            }),
          }}
        >
          <div>
            <Typography variant="h6">Destination</Typography>

            <Stack spacing={3} mt={5}>
              <Autocomplete
                fullWidth
                options={[...new Set(routes.map((route) => route.from))].filter(
                  (option) => option !== to
                )} // Exclude 'to' value
                renderInput={(params) => <TextField {...params} label="From" />}
                value={from}
                onChange={handleFromChange}
              />

              <Autocomplete
                fullWidth
                options={[...new Set(routes.map((route) => route.to))].filter(
                  (option) => option !== from
                )} // Exclude 'from' value
                renderInput={(params) => <TextField {...params} label="To" />}
                value={to}
                onChange={handleToChange}
                sx={{ zIndex: 0 }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                sx={{ mt: 5, mb: 3 }}
                onClick={handleCalculateRoutes}
              >
                Calculate Routes
              </Button>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Distance
                </Typography>
                <Label color="success">{distance ? `${distance} km` : 'N/A'}</Label>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Duration
                </Typography>
                <Label color="success">{duration ? `${duration} min` : 'N/A'}</Label>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Price
                </Typography>
                <Label color="success">{price ? `#${price}` : 'N/A'}</Label>
              </Stack>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <Button
                fullWidth
                size="large"
                variant="contained"
                sx={{ mt: 5, mb: 3 }}
                onClick={handlePlaceTrip}
              >
                Place Trip
              </Button>
            </Stack>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

AppView.propTypes = {
  sx: PropTypes.object,
};
