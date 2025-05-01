import {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import api from '../../api';
import Folder from '@mui/icons-material/Folder';
import useStore from '../../context/Store';

function FolderCreate({open, onClose}) {
  FolderCreate.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  const {setNotification, folders, setFolders} = useStore ();

  const [folderName, setFolderName] = useState ('');

  const handleSave = async () => {
    api
      .post ('/api/folders/', {name: folderName})
      .then (response => {
        setNotification ({
          open: true,
          message: 'Sursa de date a fost creată cu succes',
          severity: 'success',
        });
        setFolders ([...folders, response.data]);
        setFolderName ('');
        onClose (true);
      })
      .catch (error => {
        const message = error.response.data.name[0] ===
          'folder with this name already exists.'
          ? 'Sursa de date cu acest nume exista deja!'
          : 'Eroare la creearea sursei de date!';
        setNotification ({
          open: true,
          message: message,
          severity: 'error',
        });
        onClose (false);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        {'Creaza o sursă de date nouă'}
      </DialogTitle>
      <DialogContent
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        <Folder
          sx={{
            fontSize: 50,
            color: 'primary.main',
            display: 'block',
            margin: 'auto',
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          sx={{width: '400px'}}
          label="Numele sursei de date"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={e => setFolderName (e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{marginBottom: 2, marginRight: 2}}>
        <Button variant="contained" onClick={onClose} color="primary">
          Renunță
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          color="primary"
          autoFocus
          disabled={!folderName.trim ()}
        >
          Salvează
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default FolderCreate;
