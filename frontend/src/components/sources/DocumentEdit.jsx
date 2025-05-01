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

function DocumentEdit({open, onClose, documentId}) {
  DocumentEdit.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    documentId: PropTypes.number.isRequired,
  };

  const {setNotification, documents, setDocuments} = useStore ();
  const [documentName, setDocumentName] = useState ('');

  useEffect (
    () => {
      if (documentId) {
        api.get (`/api/documents/${documentId}/`).then (response => {
          setDocumentName (response.data.name.split ('.')[0]);
        });
      }
    },
    [open, documentId]
  );

  const handleConfirm = () => {
    api
      .patch (`/api/documents/${documentId}/`, {name: documentName})
      .then (response => {
        setDocuments (
          documents.map (
            document =>
              document.id === documentId
                ? {...document, name: response.data.name}
                : document
          )
        );
        setNotification ({
          open: true,
          message: 'Numele documentului a fost modificat cu succes',
          severity: 'success',
        });
        onClose (true);
      })
      .catch (error => {
        const message = error.response.data.name[0] ===
          'document with this name already exists.'
          ? 'Documentul cu acest nume exista deja!'
          : 'Eroare la editarea documentului!';
        setNotification ({
          open: true,
          message: message,
          severity: 'error',
        });
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        Modifică numele documentului
      </DialogTitle>
      <DialogContent sx={{marginTop: 2}}>
        <TextField
          autoFocus
          margin="dense"
          label="Numele documentului"
          type="text"
          fullWidth
          variant="outlined"
          value={documentName}
          onChange={e => setDocumentName (e.target.value)}
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

export default DocumentEdit;
