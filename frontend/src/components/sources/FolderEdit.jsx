import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import useStore from '../../context/Store';
import api from '../../api';

function FolderEdit({open, onClose, folderId}) {
  FolderEdit.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    folderId: PropTypes.number.isRequired,
  };

  const {setNotification, folders, setFolders} = useStore ();
  const [folderName, setFolderName] = useState ('');

  useEffect (
    () => {
      if (folderId) {
        api.get (`/api/folders/${folderId}/`).then (response => {
          setFolderName (response.data.name);
        });
      }
    },
    [open, folderId]
  );
  const handleConfirm = () => {
    api
      .patch (`/api/folders/${folderId}/`, {name: folderName})
      .then (response => {
        setFolders (
          folders.map (
            folder =>
              folder.id === folderId
                ? {...folder, name: response.data.name}
                : folder
          )
        );
        setNotification ({
          open: true,
          message: 'Numele sursei de date a fost modificat cu succes',
          severity: 'success',
        });
        onClose (true);
      })
      .catch (error => {
        const message = error.response.data.name[0] ===
          'folder with this name already exists.'
          ? 'Sursa de date cu acest nume exista deja!'
          : 'Eroare la editarea sursei de date!';
        setNotification ({
          open: true,
          message: message,
          severity: 'error',
        });
        onClose (false);
      });
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        Modifică numele sursei de date
      </DialogTitle>
      <DialogContent sx={{marginTop: 2}}>
        <TextField
          autoFocus
          margin="dense"
          label="Numele sursei de date"
          type="text"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={e => setFolderName (e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{marginBottom: 2, marginRight: 2}}>
        <Button variant="contained" onClick={onClose} color="primary">
          Anulează
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          color="primary"
          autoFocus
        >
          Modifică
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FolderEdit;
