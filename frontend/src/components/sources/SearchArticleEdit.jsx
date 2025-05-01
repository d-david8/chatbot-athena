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

const SearchArticleEdit = ({open, onClose, articleId}) => {
  SearchArticleEdit.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    articleId: PropTypes.string.isRequired,
  };

  const {setNotification} = useStore ();

  const [formData, setFormData] = useState ({
    title: '',
    content: '',
    id: '',
  });

  const [errors, setErrors] = useState ({});

  useEffect (
    () => {
      console.log ('ArticleEdit open:', open);
      console.log ('ArticleEdit articleId:', articleId);
      if (open && articleId) {
        api
          .get (`/api/articles/?id=${articleId}`)
          .then (response => {
            console.log ('Response from API:', response.data[0]);
            setFormData ({
              title: response.data[0].title,
              content: response.data[0].content,
              id: response.data[0].id,
            });
          })
          .catch (error => {
            console.error ('Error fetching article:', error);
          });
      }
    },
    [open, articleId]
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
        .put (`/api/articles/${articleId}/`, formData)
        .then (() => {
          setNotification ({
            open: true,
            message: 'Articolul a fost actualizat cu succes',
            severity: 'success',
          });
          handleClose ();
        })
        .catch (error => {
          setNotification ({
            open: true,
            message: 'Eroare la actualizarea articolului!',
            severity: 'error',
          });
          console.error ('Error updating article:', error);
        });
    }
  };

  const handleClose = () => {
    setFormData ({
      title: '',
      content: '',
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
          Editare Articol
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
                rows={6} // Allows multiline input
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
              Actualizează
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchArticleEdit;
