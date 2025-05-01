import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import api from '../../api';
import useStore from '../../context/Store';

function FolderDelete({open, onClose, folderId}) {
  FolderDelete.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    folderId: PropTypes.number.isRequired,
  };

  const [folderName, setFolderName] = useState ('');
  const {setNotification, folders, setFolders} = useStore ();

  useEffect (
    () => {
      console.log ('delete: folderId', folderId);
      if (folderId) {
        api.get (`/api/folders/${folderId}/`).then (response => {
          setFolderName (response.data.name);
        });
      }
    },
    [folderId, open]
  );

  const onConfirm = async () => {
    api
      .delete (`/api/folders/${folderId}/`)
      .then (() => {
        setNotification ({
          open: true,
          message: 'Sursa de date a fost ștearsă cu succes',
          severity: 'success',
        });
        setFolders (folders.filter (folder => folder.id !== folderId));
        onClose (true);
      })
      .catch (() => {
        setNotification ({
          open: true,
          message: 'Eroare la ștergerea sursei de date!',
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
        Confirmare ștergere sursa de date
      </DialogTitle>
      <DialogContent sx={{marginTop: 2}}>
        <Typography variant="body1" gutterBottom>
          Ești sigur că vrei să ștergi sursa de date
          {' '}
          <strong>{folderName}</strong>
          ?
          Această acțiune nu poate fi anulată și toate documentele asociate vor fi, de asemenea, șterse.
        </Typography>
      </DialogContent>
      <DialogActions sx={{marginBottom: 2, marginRight: 2}}>
        <Button variant="contained" onClick={onClose} color="primary">
          Anulează
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          color="secondary"
          autoFocus
        >
          Șterge
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FolderDelete;
