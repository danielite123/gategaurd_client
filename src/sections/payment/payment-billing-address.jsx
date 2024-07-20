import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function PaymentBillingAddress() {
  return (
    <div>
      <Typography variant="h6">Billing Address</Typography>

      <Stack spacing={3} mt={5}>
        <TextField fullWidth label="Account Name" />
        <TextField fullWidth label="Card Number" />
        <TextField fullWidth label="Expiry Date" />
        <TextField fullWidth label="CVV" />
      </Stack>
    </div>
  );
}
