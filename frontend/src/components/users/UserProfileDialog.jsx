import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import api from '../../api';
import Notification from '../Notification';

const UserProfileDialog = ({open, onClose}) => {
  const [formData, setFormData] = useState ({
    id: 0,
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState ({});

  const [notification, setNotification] = useState ({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect (
    () => {
      const fetchUser = async () => {
        try {
          const response = await api.get ('/api/users/me/');
          const user = response.data;
          setFormData (prev => ({
            ...prev,
            id: user.id,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            username: user.username || '',
            email: user.email || '',
          }));
        } catch (error) {
          console.error ('Eroare la încărcarea datelor utilizatorului:', error);
        }
      };

      if (open) {
        fetchUser ();
      }
    },
    [open]
  );

  const handleChange = e => {
    const {name, value} = e.target;
    setFormData ({...formData, [name]: value});
    setErrors ({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name)
      newErrors.first_name = 'Prenumele este obligatoriu';
    if (!formData.last_name) newErrors.last_name = 'Numele este obligatoriu';
    if (!formData.username)
      newErrors.username = 'Utilizatorul este obligatoriu';
    if (!formData.email) newErrors.email = 'Emailul este obligatoriu';
    else if (!/\S+@\S+\.\S+/.test (formData.email))
      newErrors.email = 'Email invalid';

    if (
      formData.old_password ||
      formData.new_password ||
      formData.confirm_password
    ) {
      if (!formData.old_password)
        newErrors.old_password = 'Introduceți parola actuală';
      if (!formData.new_password)
        newErrors.new_password = 'Introduceți o parolă nouă';
      if (formData.new_password !== formData.confirm_password) {
        newErrors.confirm_password = 'Parolele nu se potrivesc';
      }
    }

    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    const validationErrors = validate ();
    if (Object.keys (validationErrors).length > 0) {
      setErrors (validationErrors);
      return;
    }

    try {
      // 1. Actualizare date profil
      await api.put (`/api/users/${formData.id}/`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
      });

      // 2. Schimbare parolă (dacă sunt completate)
      if (formData.old_password && formData.new_password) {
        await api.put (`/api/users/${formData.id}/password/`, {
          old_password: formData.old_password,
          new_password: formData.new_password,
        });
      }
      setNotification ({
        open: true,
        message: 'Profil actualizat cu succes',
        severity: 'success',
      });
      setTimeout (() => {
        setNotification ({open: false});
      }, 3000);
      setFormData ({
        id: formData.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      setErrors ({});
      onClose ();
    } catch (error) {
      setNotification ({
        open: true,
        message: 'Eroare la actualizarea profilului',
        severity: 'error',
      });
      setTimeout (() => {
        setNotification ({open: false});
      }, 3000);

      onClose ();
    }
  };

  return (
    <Box>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification ({open: false})}
      />
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{backgroundColor: 'primary.main', color: 'background.default'}}
        >
          <Typography variant="inherit" align="center">
            Profilul meu
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 2}}
          >
            <TextField
              label="ID"
              name="id"
              value={formData.id}
              disabled
              fullWidth
            />
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: {xs: 'column', sm: 'row'},
              }}
            >
              <TextField
                label="Prenume"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                error={!!errors.first_name}
                helperText={errors.first_name}
              />
              <TextField
                label="Nume"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
            </Box>
            <TextField
              label="Utilizator"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />

            {/* Parole */}
            <TextField
              label="Parolă actuală"
              name="old_password"
              type="password"
              value={formData.old_password}
              onChange={handleChange}
              fullWidth
              error={!!errors.old_password}
              helperText={errors.old_password}
            />
            <TextField
              label="Parolă nouă"
              name="new_password"
              type="password"
              value={formData.new_password}
              onChange={handleChange}
              fullWidth
              error={!!errors.new_password}
              helperText={errors.new_password}
            />
            <TextField
              label="Confirmă parolă nouă"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              fullWidth
              error={!!errors.confirm_password}
              helperText={errors.confirm_password}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">
            Anulează
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Salvează
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

UserProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserProfileDialog;
