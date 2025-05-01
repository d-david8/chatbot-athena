import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
import useStore from '../../context/Store';
import api from '../../api';

function DocumentDelete({open, onClose, documentId}) {
  DocumentDelete.propTypes = {
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
      .delete (`/api/documents/${documentId}/`)
      .then (() => {
        setDocuments (
          documents.filter (document => document.id !== documentId)
        );
        setNotification ({
          open: true,
          message: 'Documentul a fost șters cu succes',
          severity: 'success',
        });
        onClose (true);
      })
      .catch (() => {
        setNotification ({
          open: true,
          message: 'Eroare la ștergerea documentului',
          severity: 'error',
        });
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        Confirmare ștergere document
      </DialogTitle>
      <DialogContent sx={{marginTop: 2}}>
        <Typography variant="body1" gutterBottom>
          Ești sigur că vrei să ștergi documentul
          {' '}
          <strong>{documentName}</strong>
          ?
          Această acțiune nu poate fi anulată și toate articolele asociate vor fi, de asemenea, șterse.
        </Typography>
      </DialogContent>
      <DialogActions sx={{marginBottom: 2, marginRight: 2}}>
        <Button variant="contained" onClick={onClose} color="primary">
          Anulează
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          color="secondary"
          autoFocus
        >
          Șterge
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DocumentDelete;
