import {useState, useRef} from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  Grid,
  Popover,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Importă iconița de editare
import api from '../../api';
import SearchArticleEdit from './SearchArticleEdit';
import useStore from '../../context/Store';

const SearchArticles = () => {
  const [query, setQuery] = useState ('');
  const [articles, setArticles] = useState ([]);
  const [anchorEl, setAnchorEl] = useState (null);
  const [loading, setLoading] = useState (false);
  const searchFieldRef = useRef (null);

  const {
    articleId,
    setArticleId,
    openAdvancedSearchDialog,
    setOpenAdvancedSearchDialog,
  } = useStore ();

  const handleSearch = async () => {
    setLoading (true);
    try {
      const response = await api.get (`/api/advance_search/?query=${query}`);
      console.log ('Response from API:', response.data); // Verifică răspunsul API
      setArticles (response.data || []);
      setAnchorEl (searchFieldRef.current);
    } catch (error) {
      console.error ('Eroare la căutare:', error);
    } finally {
      setLoading (false);
    }
  };

  const handleClose = () => {
    setAnchorEl (null);
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      handleSearch ();
    }
  };

  const handleEdit = articleId => {
    setArticleId (articleId);
    setOpenAdvancedSearchDialog (true);
  };

  const handleCloseEdit = () => {
    setOpenAdvancedSearchDialog (false);
    handleSearch ();
  };

  const open = Boolean (anchorEl);

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      marginBottom={3}
      marginTop={3}
      marginLeft={0}
    >
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          <TextField
            label="Căutare articole"
            variant="outlined"
            value={query}
            onChange={e => setQuery (e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            inputRef={searchFieldRef}
          />
        </Grid>
        <Grid item marginRight={1}>
          <Button onClick={handleSearch} variant="contained" color="primary">
            Caută articole
          </Button>
        </Grid>
      </Grid>

      <Popover
        open={open && !loading}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          maxHeight: '500px',
        }} // Setează lățimea popover-ului
      >
        <Grid container>
          <Typography
            variant="h6"
            sx={{padding: 1, marginBottom: -2, fontWeight: 'bold'}}
          >
            Rezultatele căutării
          </Typography>
          <Grid item xs={12}>
            <List>
              {loading
                ? <ListItem>
                    <ListItem primary={<CircularProgress size={24} />} />
                  </ListItem>
                : articles.length > 0
                    ? articles.map (article => (
                        <ListItem key={article.id} sx={{padding: 0}}>
                          <Card
                            sx={{
                              width: '100%',
                              borderRadius: 2,
                              margin: 1,
                              boxShadow: 2,
                            }}
                          >
                            <CardContent>
                              <Grid container alignItems="center">
                                <Grid item xs>
                                  <Typography variant="h6">
                                    {article.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{fontWeight: 'bold', marginBottom: 1}}
                                  >
                                    Score: {article.score}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{fontWeight: 'bold', marginBottom: 1}}
                                  >
                                    Continutul articolului:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {article.content}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <IconButton
                                    aria-label="edit"
                                    color="primary"
                                    onClick={() => handleEdit (article.id)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </ListItem>
                      ))
                    : <ListItem>
                        <Typography primary={true}>
                          Niciun articol găsit.
                        </Typography>
                      </ListItem>}
            </List>
          </Grid>
        </Grid>
      </Popover>
      {openAdvancedSearchDialog &&
        articleId &&
        <SearchArticleEdit
          open={openAdvancedSearchDialog}
          articleId={articleId}
          onClose={handleCloseEdit}
        />}
    </Grid>
  );
};

export default SearchArticles;
