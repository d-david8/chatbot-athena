import {useState, useEffect} from 'react';
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

const ArticleCreate = ({open, onClose, folderId, documentId}) => {
  ArticleCreate.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    folderId: PropTypes.number.isRequired,
    documentId: PropTypes.number.isRequired,
  };

  const {setNotification, articles, setArticles} = useStore ();

  const [formData, setFormData] = useState ({
    title: '',
    content: '',
    folder_id: folderId,
    document_id: documentId,
  });

  const [errors, setErrors] = useState ({});

  useEffect (
    () => {
      setFormData ({
        title: '',
        content: '',
        folder_id: folderId,
        document_id: documentId,
      });
      setErrors ({});
    },
    [open, folderId, documentId]
  );

  const handleChange = e => {
    const {name, value} = e.target;
    setFormData ({
      ...formData,
      [name]: value,
    });
    setErrors ({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = 'Titlul articolului este obligatoriu';
    }
    if (!formData.content) {
      newErrors.content = 'Conținutul articolului este obligatoriu';
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
        .post ('/api/articles/', formData)
        .then (response => {
          setNotification ({
            open: true,
            message: 'Articolul a fost creat cu succes',
            severity: 'success',
          });
          setArticles ([...articles, response.data]);
          handleClose ();
        })
        .catch (error => {
          setNotification ({
            open: true,
            message: 'Eroare la crearea articolului!',
            severity: 'error',
          });
          console.error ('Error creating article:', error);
        });
    }
  };

  const handleClose = () => {
    setFormData ({
      title: '',
      content: '',
      folder: folderId,
      document: documentId,
    });
    setErrors ({});
    onClose ();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: 'primary.main',
          color: 'background.default',
          padding: 2,
        }}
      >
        <Typography variant="inherit" align="left">
          Creare Articol
        </Typography>
      </DialogTitle>
      <DialogContent sx={{marginTop: 2, padding: 2}}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Titlu Articol"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                sx={{marginTop: 2}}
              />
              {errors.title &&
                <Typography variant="body2" color="error">
                  {errors.title}
                </Typography>}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Conținut Articol"
                name="content"
                value={formData.content}
                onChange={handleChange}
                multiline
                rows={6} // Permite scrierea pe mai multe rânduri
                required
              />
              {errors.content &&
                <Typography variant="body2" color="error">
                  {errors.content}
                </Typography>}
            </Grid>
          </Grid>

          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              Renunță
            </Button>
            <Button variant="contained" type="submit" color="primary">
              Creează
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleCreate;
