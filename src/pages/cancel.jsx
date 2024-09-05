import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Typography, Button, Paper } from '@mui/material';

// eslint-disable-next-line arrow-body-style
const CancelPage = () => {
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
          Payment Canceled
        </Typography>
        <Typography variant="h6" paragraph>
          Your payment has been canceled.
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions, please contact our support team.
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/">
          Return to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default CancelPage;
