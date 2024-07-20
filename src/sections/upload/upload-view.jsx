import axios from 'axios';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function UploadView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [profileFiles, setProfileFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDropProfile = useCallback((acceptedFiles) => {
    setProfileFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps: getProfileRootProps, getInputProps: getProfileInputProps } = useDropzone({
    onDrop: onDropProfile,
  });

  const handleUpload = async () => {
    if (profileFiles.length === 0) {
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', profileFiles[0]);

    setUploading(true);
    try {
      const response = await axios.put(
        'https://gateguard-backend.onrender.com/user/update-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth strategy
          },
        }
      );

      if (response.data.success) {
        toast.success('Profile picture updated successfully!');
        navigate('/');
      } else {
        toast.error('Failed to update profile picture.');
      }
    } catch (error) {
      toast.error('An error occurred while uploading.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography
            sx={{
              mb: 4,
            }}
            variant="h5"
          >
            Upload Profile Picture
          </Typography>

          <Typography variant="body2" sx={{ mt: 3, mb: 2 }}>
            Upload Profile Picture
          </Typography>

          <Box
            {...getProfileRootProps()}
            sx={{
              border: '2px dashed #cccccc',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input {...getProfileInputProps()} />
            <Typography variant="body1">
              Drag or drop some files here, or click to select files
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              {profileFiles.map((file) => (
                <Grid item key={file.name}>
                  <Box
                    component="img"
                    src={file.preview}
                    sx={{ width: 100, height: 100, objectFit: 'cover' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploading}
            sx={{ mt: 3 }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Card>
      </Stack>
    </Box>
  );
}
