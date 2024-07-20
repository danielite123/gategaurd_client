import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import axios from 'axios';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

mapboxgl.accessToken =
  'pk.eyJ1IjoibWlwYXNjaGFsIiwiYSI6ImNseXB5dnV4djBweDkya3F0aDh5N2N2MzUifQ.k5SttHIe-50qO95Kx-BFJQ'; // Replace with your Mapbox access token

const calculatePrice = (distance) => {
  return parseFloat(distance) * 10; // Example calculation: $10 per kilometer
};

export default function AppView(props) {
  const { sx, ...other } = props;
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState(''); // Add price state

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
      attributionControl: false,
    });

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/driving',
    });

    map.current.addControl(directions, 'top-left');

    setDirections(directions);
  }, []);

  const handleInputChange = async (e, setValue, setSuggestions) => {
    const value = e.target.value;
    setValue(value);

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`,
        {
          params: {
            access_token: mapboxgl.accessToken,
            autocomplete: true,
          },
        }
      );
      const data = response.data;
      setSuggestions(
        data.features.map((feature) => ({
          id: feature.id,
          place_name: feature.place_name,
          coordinates: feature.center,
        }))
      );
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSuggestionClick = (place_name, coordinates, setValue, setSuggestions, isFrom) => {
    setValue(place_name);
    setSuggestions([]);
    if (isFrom) {
      directions.setOrigin(coordinates);
    } else {
      directions.setDestination(coordinates);
    }
  };

  const handleCalculateRoute = () => {
    if (fromValue && toValue) {
      directions.setOrigin(fromValue);
      directions.setDestination(toValue);

      directions.on('route', (event) => {
        const route = event.route[0];
        const distance = (route.distance / 1000).toFixed(2); // Convert meters to kilometers
        const duration = (route.duration / 3600).toFixed(2); // Convert seconds to hours

        setDistance(`${distance} km`);
        setDuration(`${duration} hr`);

        const calculatedPrice = calculatePrice(distance);
        setPrice(`#${calculatedPrice.toFixed(2)}`); // Set the price
      });
    }
  };

  const handlePlaceTrip = async () => {
    if (fromValue && toValue && distance && duration && price) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/order/create-order',
          {
            from: fromValue,
            to: toValue,
            distance,
            duration,
            price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const orderId = response.data._id; // Extract the order ID from the response
        console.log('Order placed successfully:', response.data);
        navigate(`/payment?orderId=${orderId}`); // Pass orderId as a query parameter
      } catch (error) {
        console.error('Error placing order:', error);
      }
    } else {
      console.error('Please provide all required information.');
    }
  };

  return (
    <Container sx={{ minHeight: 1 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container rowSpacing={{ xs: 5, md: 0 }} columnSpacing={{ xs: 0, md: 5 }}>
        <Grid xs={12} md={8}>
          <Box
            gap={5}
            display="grid"
            sx={{
              borderRadius: 2,
              border: (theme) => ({
                md: `dashed 1px ${theme.palette.divider}`,
              }),
            }}
          >
            <Box
              sx={{
                borderRadius: 2,
                bgcolor: 'background.neutral',
                ...sx,
              }}
              {...other}
            >
              <div ref={mapContainer} style={{ height: '530px', width: '100%' }} />
            </Box>
          </Box>
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
              <TextField
                fullWidth
                label="From"
                value={fromValue}
                onChange={(e) => handleInputChange(e, setFromValue, setFromSuggestions, true)}
              />
              {fromSuggestions.length > 0 && (
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                  }}
                >
                  {fromSuggestions.map((suggestion) => (
                    <Box
                      key={suggestion.id}
                      sx={{ p: 2, cursor: 'pointer' }}
                      onClick={() =>
                        handleSuggestionClick(
                          suggestion.place_name,
                          suggestion.coordinates,
                          setFromValue,
                          setFromSuggestions,
                          true
                        )
                      }
                    >
                      {suggestion.place_name}
                    </Box>
                  ))}
                </Box>
              )}

              <TextField
                fullWidth
                label="To"
                value={toValue}
                onChange={(e) => handleInputChange(e, setToValue, setToSuggestions, false)}
                sx={{ zIndex: 0 }}
              />
              {toSuggestions.length > 0 && (
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                  }}
                >
                  {toSuggestions.map((suggestion) => (
                    <Box
                      key={suggestion.id}
                      sx={{ p: 2, cursor: 'pointer' }}
                      onClick={() =>
                        handleSuggestionClick(
                          suggestion.place_name,
                          suggestion.coordinates,
                          setToValue,
                          setToSuggestions,
                          false
                        )
                      }
                    >
                      {suggestion.place_name}
                    </Box>
                  ))}
                </Box>
              )}

              <Button
                fullWidth
                size="large"
                variant="contained"
                sx={{ mt: 5, mb: 3 }}
                onClick={handleCalculateRoute}
              >
                Calculate Routes
              </Button>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Distance
                </Typography>
                <Label color="success">{distance}</Label>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Duration
                </Typography>
                <Label color="success">{duration}</Label>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Price
                </Typography>
                <Label color="success">{price}</Label>
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
