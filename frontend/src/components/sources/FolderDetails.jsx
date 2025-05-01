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

function FolderDetails({open, onClose, folderId}) {
  FolderDetails.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    folderId: PropTypes.number.isRequired,
  };

  const [folderDetails, setFolderDetails] = useState ({
    name: '',
    created_at: '',
    created_by: '',
    updated_at: '',
    updated_by: '',
  });

  useEffect (
    () => {
      if (folderId) {
        api.get (`/api/folders/${folderId}/`).then (response => {
          setFolderDetails ({
            name: response.data.name,
            created_at: response.data.created_at,
            created_by: response.data.created_by_user,
            updated_at: response.data.updated_at,
            updated_by: response.data.updated_by_user,
          });
        });
      }
    },
    [folderId, open]
  );
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        Detaliile sursei de date
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
                {folderId || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          {/* Nume */}
          <Grid item xs={9}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Numele suresei de date:
              </Typography>
              <Typography variant="body2">
                {folderDetails.name}
              </Typography>
            </Box>
          </Grid>

          {/* Data creării */}
          <Grid item xs={6}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Data creării:
              </Typography>
              <Typography variant="body2">
                {folderDetails.created_at !== ''
                  ? folderDetails.created_at.split ('T')[0] +
                      ' ' +
                      folderDetails.created_at.split ('T')[1].split ('.')[0]
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>

          {/* Creat de */}
          <Grid item xs={6}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Creat de:
              </Typography>
              <Typography variant="body2">
                {folderDetails.created_by}
              </Typography>
            </Box>
          </Grid>

          {/* Data ultimei modificări */}
          <Grid item xs={6}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Data ultimei modificări:
              </Typography>
              <Typography variant="body2">
                {folderDetails.updated_at !== ''
                  ? folderDetails.updated_at.split ('T')[0] +
                      ' ' +
                      folderDetails.updated_at.split ('T')[1].split ('.')[0]
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>

          {/* Modificat de */}
          <Grid item xs={6}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Modificat de:
              </Typography>
              <Typography variant="body2">
                {folderDetails.updated_by}
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

export default FolderDetails;
