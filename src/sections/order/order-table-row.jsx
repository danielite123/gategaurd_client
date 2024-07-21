import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function UserTableRow({
  selected,
  id,
  from,
  to,
  price,
  status,
  distance,
  duration,
  handleClick,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleCancelOrder = async () => {
    if (status !== 'completed') {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.put(
          `https://gateguard-backend.onrender.com/order/cancel-order/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Order cancelled:', response.data);
        toast.success('Order cancelled successfully');

        window.location.reload();
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error('Failed to cancel order. Please try again.');
      } finally {
        handleCloseMenu();
      }
    } else {
      console.log('Cannot cancel order with completed status.');
    }
  };

  const handleCompleteOrder = async () => {
    if (status === 'cancelled') {
      console.log('Cannot complete order with cancelled status.');
      toast.error('Cannot complete order with cancelled status.');
      return; // Exit the function if the status is cancelled
    }

    if (status !== 'pending') {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.put(
          `https://gateguard-backend.onrender.com/order/complete-order/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Order completed:', response.data);
        toast.success('Order completed successfully');

        window.location.reload();
      } catch (error) {
        console.error('Error completing order:', error);
      } finally {
        handleCloseMenu();
      }
    } else {
      console.log('Cannot complete order with pending status.');
      toast.error('Cannot complete order with pending status.');
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox" />
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {from}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{to}</TableCell>
        <TableCell>#{price}</TableCell>
        <TableCell>
          <Label color={(status === 'cancelled' && 'error') || 'success'}>{status}</Label>
        </TableCell>
        <TableCell>{distance}</TableCell>
        <TableCell>{duration}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCancelOrder} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Cancel
        </MenuItem>
        <MenuItem onClick={handleCompleteOrder}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2, color: 'success.main' }} />
          Complete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  to: PropTypes.any,
  handleClick: PropTypes.func,
  id: PropTypes.any,
  from: PropTypes.any,
  price: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  distance: PropTypes.string,
  duration: PropTypes.string,
};
