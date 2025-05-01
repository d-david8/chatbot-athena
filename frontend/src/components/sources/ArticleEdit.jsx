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

const ArticleEdit = ({open, onClose, articleId}) => {
  ArticleEdit.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    articleId: PropTypes.string.isRequired,
  };

  const {setNotification, articles, setArticles} = useStore ();

  const [formData, setFormData] = useState ({
    title: '',
    content: '',
  });

  const [errors, setErrors] = useState ({});

  useEffect (
    () => {
      console.log ('ArticleEdit open:', open);
      console.log ('ArticleEdit articleId:', articleId);
      if (open && articleId) {
        const foundedArticle = articles.find (art => art.id === articleId);
        setFormData ({
          title: foundedArticle.title,
          content: foundedArticle.content,
        });
        console.log (foundedArticle);
      }
    },
    [open, articleId, articles]
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
          const updatedArt = articles.find (art => art.id === articleId);
          updatedArt.title = formData.title;
          updatedArt.content = formData.content;
          const updatedArticles = articles.map (
            art => (art.id === articleId ? updatedArt : art)
          );
          setArticles (updatedArticles);
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

export default ArticleEdit;
