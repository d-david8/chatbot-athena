import {useEffect, useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import api from '../../api';
import useStore from '../../context/Store';

const DocumentCreate = ({open, onClose, folderId}) => {
  DocumentCreate.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    folderId: PropTypes.number.isRequired,
  };

  const {setNotification, documents, setDocuments} = useStore ();

  const [formData, setFormData] = useState ({
    file: null,
    name: '',
    folder: folderId,
  });
  const [errors, setErrors] = useState ({});

  useEffect (
    () => {
      setFormData ({
        file: null,
        name: '',
        folder: folderId,
      });
      setErrors ({});
    },
    [open, folderId]
  );

  function handleChange (e) {
    const {name, value, type, files} = e.target;
    if (type === 'file') {
      setFormData ({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData ({
        ...formData,
        [name]: value,
      });
    }
    setErrors ({});
  }

  const validate = () => {
    const newErrors = {};
    if (!formData.file) {
      newErrors.document = 'Documentul este obligatoriu';
    }
    if (!formData.name) {
      newErrors.name = 'Numele documentului este obligatoriu';
    }
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    const validationErrors = validate ();
    if (Object.keys (validationErrors).length > 0) {
      setErrors (validationErrors);
    } else {
      api
        .post ('/api/documents/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then (response => {
          setNotification ({
            open: true,
            message: 'Documentul a fost încărcat cu succes',
            severity: 'success',
          });
          setDocuments ([...documents, response.data]);
          handleClose ();
        })
        .catch (error => {
          setNotification ({
            open: true,
            message: 'Eroare la încărcarea documentului!',
            severity: 'error',
          });
          console.error ('Error uploading document:', error);
        });
    }
  };

  const handleClose = () => {
    setFormData ({
      file: null,
      name: '',
      folder: folderId,
    });
    setErrors ({});
    onClose ();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        <Typography variant="inherit" align="left">
          Încărcare document
        </Typography>
      </DialogTitle>
      <DialogContent sx={{marginTop: 2}}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{marginTop: 0}}>
            <Grid item xs={12}>
              <input
                accept="*"
                style={{display: 'none'}} // Ascunde input-ul de fișier
                id="file-upload"
                type="file"
                name="file"
                onChange={handleChange}
                required
              />

              {/* Buton personalizat pentru a selecta fișierul */}
              <label htmlFor="file-upload">
                <Button variant="contained" component="span">
                  Alege fisier
                </Button>
              </label>
              {/* Afișează numele fișierului selectat */}
              {formData.file &&
                <Typography
                  variant="body2"
                  sx={{marginLeft: 2, display: 'inline-block'}}
                >
                  {formData.file.name}
                </Typography>}

              {/* Mesaj de eroare, dacă există */}
              {errors.document &&
                <Typography variant="body2" color="error">
                  {errors.document}
                </Typography>}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Numele document"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name &&
                <Typography variant="body2" color="error">
                  {errors.name}
                </Typography>}
            </Grid>
          </Grid>

          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              Renunță
            </Button>
            <Button variant="contained" type="submit" color="primary">
              Încarcă
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentCreate;
