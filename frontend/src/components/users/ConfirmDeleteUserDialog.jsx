import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

function ConfirmDeleteUserDialog({open, onClose, onConfirm}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        {'Confirmare ștergere utilizator'}
      </DialogTitle>
      <DialogContent sx={{marginTop: 2}}>
        <DialogContentText>
          Ești sigur că vrei să ștergi acest utilizator? Această acțiune nu
          poate fi anulată.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{marginBottom: 2, marginRight: 2}}>
        <Button variant="contained" onClick={onClose} color="primary">
          Anulează
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          color="primary"
          autoFocus
        >
          Șterge
        </Button>
      </DialogActions>
    </Dialog>
  );
}
ConfirmDeleteUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDeleteUserDialog;
