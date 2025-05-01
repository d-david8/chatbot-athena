import {Box, Typography, Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

function NotFound () {
  const navigate = useNavigate ();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: 'background.default',
        color: 'text.primary',
        padding: 3,
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Pagina nu a fost găsită
      </Typography>
      <Typography variant="body1" gutterBottom>
        Ne pare rău, dar pagina pe care o căutați nu există.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate ('/')}
        sx={{marginTop: 2}}
      >
        Înapoi la pagina principală
      </Button>
    </Box>
  );
}

export default NotFound;
