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
  Radio,
  RadioGroup,
  FormControl,
} from '@mui/material';
import PropTypes from 'prop-types';

const UserDetailDialog = ({open, onClose, user}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        <Typography variant="inherit" align="center">
          Detalii utilizator
        </Typography>
      </DialogTitle>

      <DialogContent>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '16px',
          }}
        >
          {/* ID field */}
          <Box sx={{display: 'flex', gap: 2, mb: 2}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Id"
              name="id"
              value={user.id}
              disabled
            />
          </Box>

          {/* Name fields side by side */}
          <Box sx={{display: 'flex', gap: 2, mb: 2}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Prenume"
              name="first_name"
              value={user.first_name}
              disabled
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Nume"
              name="last_name"
              value={user.last_name}
              disabled
            />
          </Box>

          {/* Username */}
          <Box sx={{mb: 2}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Utilizator"
              name="username"
              value={user.username}
              disabled
            />
          </Box>

          {/* Email */}
          <Box sx={{mb: 2}}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="email"
              value={user.email}
              disabled
            />
          </Box>

          {/* Admin and Status Fields */}
          <Box sx={{display: 'flex', gap: 2}}>
            {/* Superuser checkbox box */}
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
                    checked={user.is_superuser}
                    name="is_superuser"
                    color="primary"
                    disabled
                  />
                }
                label="Da"
              />
            </Box>

            {/* Status radio group */}
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
                    name="is_active"
                    value={String (user.is_active)}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio color="primary" />}
                      label="Activ"
                      disabled
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio color="primary" />}
                      label="Inactiv"
                      disabled
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          </Box>

          {/* Footer actions */}
          <DialogActions sx={{marginTop: 3}}>
            <Button variant="contained" onClick={onClose} color="primary">
              Închide
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
UserDetailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape ({
    id: PropTypes.number,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    is_superuser: PropTypes.bool,
    is_active: PropTypes.bool,
  }).isRequired,
};

export default UserDetailDialog;
