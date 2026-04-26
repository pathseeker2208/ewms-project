import React, { useContext, useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Switch, FormControlLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { ColorModeContext } from '../theme/ThemeContext';
import { useSelector } from 'react-redux';

const Settings = () => {
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
    }
  });

  const onSubmit = (data) => {
    api.put('/users/profile', data)
      .then(res => toast.success(res.data))
      .catch(err => toast.error('Failed to update profile'));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Appearance</Typography>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleColorMode} />}
          label="Toggle Dark Mode"
        />
      </Paper>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>Edit Profile</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            {...register('name')}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="New Password"
            helperText="Leave blank if you don't want to change"
            {...register('password')}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Settings;
