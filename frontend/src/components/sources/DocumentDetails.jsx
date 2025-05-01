import {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import api from '../../api';

function DocumentDetails({open, onClose, documentId}) {
  DocumentDetails.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    documentId: PropTypes.number.isRequired,
  };

  const [documentDetails, setdocumentDetails] = useState ({
    name: '',
    created_at: '',
    created_by: '',
    updated_at: '',
    updated_by: '',
    number_of_articles: '',
  });

  useEffect (
    () => {
      if (documentId) {
        api.get (`/api/documents/${documentId}/`).then (response => {
          setdocumentDetails ({
            name: response.data.name,
            created_at: response.data.created_at,
            created_by: response.data.created_by_user,
            updated_at: response.data.updated_at,
            updated_by: response.data.updated_by_user,
            number_of_articles: response.data.number_of_articles,
          });
        });
      }
    },
    [documentId, open]
  );
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        Detaliile documentului
      </DialogTitle>
      <DialogContent sx={{paddingTop: 3, marginTop: 3}}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            {/* Id */}
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Id:
              </Typography>
              <Typography variant="body2">
                {documentId || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          {/* Nume */}
          <Grid item xs={9}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Numele documentului:
              </Typography>
              <Typography variant="body2">
                {documentDetails.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Data creării:
              </Typography>
              <Typography variant="body2">
                {documentDetails.created_at !== ''
                  ? documentDetails.created_at.split ('T')[0] +
                      ' ' +
                      documentDetails.created_at.split ('T')[1].split ('.')[0]
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Creat de:
              </Typography>
              <Typography variant="body2">
                {documentDetails.created_by}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Data ultimei modificări:
              </Typography>
              <Typography variant="body2">
                {documentDetails.updated_at !== ''
                  ? documentDetails.updated_at.split ('T')[0] +
                      ' ' +
                      documentDetails.updated_at.split ('T')[1].split ('.')[0]
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Modificat de:
              </Typography>
              <Typography variant="body2">
                {documentDetails.updated_by}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Numărul de aricole:
              </Typography>
              <Typography variant="body2">
                {documentDetails.number_of_articles}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{marginBottom: 2, marginRight: 2}}>
        <Button variant="contained" onClick={onClose} color="primary">
          Închide
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DocumentDetails;
