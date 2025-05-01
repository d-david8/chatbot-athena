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
import useStore from '../../context/Store';

function ArticleDetails({open, onClose, articleId}) {
  ArticleDetails.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    articleId: PropTypes.string.isRequired,
  };

  const [articleDetails, setArticleDetails] = useState ({
    title: '',
    content: '',
    created_at: '',
    created_by: '',
    updated_at: '',
    updated_by: '',
  });

  const {articles} = useStore ();

  useEffect (
    () => {
      const foundedArticle = articles.find (art => art.id === articleId);
      setArticleDetails ({
        title: foundedArticle.title,
        content: foundedArticle.content,
        created_at: foundedArticle.created_at,
        created_by: foundedArticle.created_by_user,
        updated_at: foundedArticle.updated_at,
        updated_by: foundedArticle.updated_by_user,
      });
      console.log (foundedArticle);
    },
    [articleId, open, articles]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{backgroundColor: 'primary.main', color: 'background.default'}}
      >
        Detaliile articolului
      </DialogTitle>
      <DialogContent sx={{paddingTop: 3, marginTop: 3}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Id:
              </Typography>
              <Typography variant="body2">
                {articleId || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Titlu:
              </Typography>
              <Typography variant="body2">
                {articleDetails.title || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              component={Paper}
              padding={2}
              elevation={3}
              sx={{maxHeight: '300px', overflowY: 'auto'}}
            >
              <Typography variant="h6" gutterBottom>
                Conținut:
              </Typography>
              <Typography variant="body2">
                {articleDetails.content || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Data creării:
              </Typography>
              <Typography variant="body2">
                {articleDetails.created_at !== ''
                  ? articleDetails.created_at.split ('T')[0] +
                      ' ' +
                      articleDetails.created_at.split ('T')[1].split ('.')[0]
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
                {articleDetails.created_by || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box component={Paper} padding={2} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Data ultimei modificări:
              </Typography>
              <Typography variant="body2">
                {articleDetails.updated_at !== ''
                  ? articleDetails.updated_at.split ('T')[0] +
                      ' ' +
                      articleDetails.updated_at.split ('T')[1].split ('.')[0]
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
                {articleDetails.updated_by || 'N/A'}
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

export default ArticleDetails;
