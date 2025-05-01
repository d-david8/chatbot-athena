import {useEffect, useState} from 'react';
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
  Radio,
  RadioGroup,
  FormControl,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';

const EditUserDialog = ({open, onClose, onSubmit, user}) => {
  const [errors, setErrors] = useState ({});
  const [formData, setFormData] = useState ({
    id: 0,
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    is_active: false,
    is_superuser: false,
  });

  useEffect (
    () => {
      setFormData ({
        id: user.id || 0,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
        is_active: user.is_active || false,
        is_superuser: user.is_superuser || false,
      });
    },
    [user]
  );

  const handleChange = e => {
    const {name, value, checked, type} = e.target;
    let newValue;

    if (type === 'checkbox') {
      newValue = checked ? true : false;
    } else if (type === 'radio') {
      newValue = value === 'true';
    } else {
      newValue = value;
    }

    setFormData ({
      ...formData,
      [name]: newValue,
    });
    setErrors ({});
  };

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

  const handleSubmit = async e => {
    e.preventDefault ();
    const validationErrors = validate ();
    if (Object.keys (validationErrors).length > 0) {
      setErrors (validationErrors);
    } else {
      try {
        await onSubmit (formData).then (() => {
          setFormData ({
            id: 0,
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            is_active: false,
            is_superuser: false,
          });
          setErrors ({});
          onClose ();
        });
      } catch (error) {
        console.log (error);
      }
    }
  };

  const handleClose = () => {
    setFormData ({
      id: user.id || 0,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      username: user.username || '',
      email: user.email || '',
      is_active: user.is_active || 0,
      is_superuser: user.is_superuser || 0,
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
          Editează utilizator
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
          {/* User ID (disabled) */}
          <Box sx={{display: 'flex', gap: 2}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Id"
              name="id"
              value={formData.id}
              required
              disabled
            />
            <Box sx={{flex: 1}} />
          </Box>

          {/* Name Fields */}
          <Box sx={{display: 'flex', gap: 2, mt: 2}}>
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
          <Box sx={{mt: 2}}>
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
          <Box sx={{mt: 2}}>
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

          {/* Superuser Checkbox */}
          <Box sx={{display: 'flex', gap: 2, mt: 2}}>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'grey.400',
                borderRadius: 1,
                padding: 2,
                position: 'relative',
                flex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: '-10px',
                  left: '10px',
                  backgroundColor: 'background.paper',
                  padding: '0 4px',
                }}
              >
                Administrator
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_superuser}
                    onChange={handleChange}
                    name="is_superuser"
                    color="primary"
                  />
                }
                label="Da"
              />
            </Box>

            {/* Status RadioGroup */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'grey.400',
                borderRadius: 1,
                padding: 2,
                position: 'relative',
                flex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: '-10px',
                  left: '10px',
                  backgroundColor: 'background.paper',
                  padding: '0 4px',
                }}
              >
                Status
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="status"
                    name="is_active"
                    value={formData.is_active.toString ()}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio color="primary" />}
                      label="Activ"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio color="primary" />}
                      label="Inactiv"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          </Box>

          {/* Form Actions */}
          <DialogActions sx={{marginTop: 2}}>
            <Button variant="contained" onClick={handleClose} color="primary">
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

EditUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.shape ({
    id: PropTypes.number,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    is_active: PropTypes.bool,
    is_superuser: PropTypes.bool,
  }).isRequired,
};

export default EditUserDialog;
