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

function ArticleDelete({open, onClose, articleId}) {
  ArticleDelete.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    articleId: PropTypes.string.isRequired,
  };

  const {setNotification, articles, setArticles} = useStore ();
  const [articleTitle, setArticleTitle] = useState ('');

  useEffect (
    () => {
      if (articleId) {
        setArticleTitle (articles.find (art => art.id === articleId).title);
        console.log ('verif');
      }
    },
    [open, articleId, articles]
  );

  const handleConfirm = () => {
    api
      .delete (`/api/articles/?id=${articleId}`)
      .then (() => {
        setArticles (articles.filter (art => art.id !== articleId));
        setNotification ({
          open: true,
          message: 'Articolul a fost șters cu succes',
          severity: 'success',
        });
        onClose (true);
      })
      .catch (() => {
        setNotification ({
          open: true,
          message: 'Eroare la ștergerea articolului',
          severity: 'error',
        });
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        Confirmare ștergere articol
      </DialogTitle>
      <DialogContent sx={{marginTop: 2}}>
        <Typography variant="body1" gutterBottom>
          Ești sigur că vrei să ștergi articolul
          {' '}
          <strong>{articleTitle}</strong>
          ?
          Această acțiune nu poate fi anulată.
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
export default ArticleDelete;
