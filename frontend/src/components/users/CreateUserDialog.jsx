import {useState} from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';

const CreateUserDialog = ({open, onClose, onSubmit}) => {
  const [formData, setFormData] = useState ({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    is_superuser: 0,
    is_active: 1,
  });
  const [errors, setErrors] = useState ({});

  // Handle input changes
  const handleChange = e => {
    const {name, value, checked, type} = e.target;
    const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setFormData ({
      ...formData,
      [name]: newValue,
    });
    setErrors ({});
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {};
    if (!formData.first_name)
      newErrors.first_name = 'Prenumele este obligatoriu';
    if (!formData.last_name) newErrors.last_name = 'Numele este obligatoriu';
    if (!formData.username)
      newErrors.username = 'Utilizatorul este obligatoriu';
    if (!formData.email) {
      newErrors.email = 'Emailul este obligatoriu';
    } else if (!/\S+@\S+\.\S+/.test (formData.email)) {
      newErrors.email = 'Emailul nu este valid';
    }
    return newErrors;
  };

  // Submit the form
  const handleSubmit = async e => {
    e.preventDefault ();
    const validationErrors = validate ();
    if (Object.keys (validationErrors).length > 0) {
      setErrors (validationErrors);
    } else {
      try {
        await onSubmit (formData);
        setFormData ({
          first_name: '',
          last_name: '',
          username: '',
          email: '',
          is_superuser: false,
          is_active: false,
        });
        setErrors ({});
        onClose ();
      } catch (error) {
        console.error ('Error creating user:', error);
        setErrors ({
          submit: 'A intervenit o eroare la crearea utilizatorului!',
        });
      }
    }
  };

  // Reset and close the dialog
  const handleClose = () => {
    setFormData ({
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      is_superuser: 0,
      is_active: 1,
    });
    setErrors ({});
    onClose ();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        <Typography variant="inherit" align="center">
          Adaugă utilizator
        </Typography>
      </DialogTitle>

      <DialogContent sx={{marginTop: 2}}>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '16px',
          }}
          onSubmit={handleSubmit}
        >
          {/* First name and last name */}
          <Box sx={{display: 'flex', gap: 2, mb: 2}}>
            <Box sx={{flex: 1}}>
              <TextField
                fullWidth
                variant="outlined"
                label="Prenume"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              {errors.first_name &&
                <Typography variant="body2" color="error">
                  {errors.first_name}
                </Typography>}
            </Box>
            <Box sx={{flex: 1}}>
              <TextField
                fullWidth
                variant="outlined"
                label="Nume"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              {errors.last_name &&
                <Typography variant="body2" color="error">
                  {errors.last_name}
                </Typography>}
            </Box>
          </Box>

          {/* Username */}
          <Box sx={{mb: 2}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Utilizator"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username &&
              <Typography variant="body2" color="error">
                {errors.username}
              </Typography>}
          </Box>

          {/* Email */}
          <Box sx={{mb: 2}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email &&
              <Typography variant="body2" color="error">
                {errors.email}
              </Typography>}
          </Box>

          {/* Checkbox for admin */}
          <Box sx={{mb: 2}}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_superuser === 1}
                  onChange={handleChange}
                  name="is_superuser"
                  color="primary"
                />
              }
              label="Este administrator"
            />
          </Box>

          {/* Dialog actions */}
          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              Renunță
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              type="submit"
              color="primary"
            >
              Salvează
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

CreateUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateUserDialog;
