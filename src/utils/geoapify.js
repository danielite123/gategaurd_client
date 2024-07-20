import axios from 'axios';

const GEOAPIFY_API_KEY = 'e65084c93e784dfca7a3730466e39cb0';

export const getAutocompleteSuggestions = async (query) => {
  const response = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete`, {
    params: {
      text: query,
      apiKey: GEOAPIFY_API_KEY,
    },
  });
  return response.data.results;
};

export const calculateRoute = async (from, to) => {
  const response = await axios.get(`https://api.geoapify.com/v1/routing`, {
    params: {
      waypoints: `${from.lat},${from.lon}|${to.lat},${to.lon}`,
      mode: 'drive',
      apiKey: GEOAPIFY_API_KEY,
    },
  });
  return response.data.routes[0];
};
