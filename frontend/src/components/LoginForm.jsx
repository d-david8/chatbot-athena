import {useState, useContext} from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {TextField, Button, Box, Typography} from '@mui/material';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constants';
import {LogedUserContext} from '../context/LogedUserContext';
import api from '../api';

function LoginForm({route, method}) {
  LoginForm.propTypes = {
    route: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
  };
  const [username, setUsername] = useState ('');
  const [password, setPassword] = useState ('');
  const [errormessage, setErrorMessage] = useState (null);
  const {setLogedUser} = useContext (LogedUserContext);
  const navigate = useNavigate ();

  const handleSubmit = async e => {
    e.preventDefault ();
    if (username === '' || password === '') {
      setErrorMessage ('Utilizatorul si parola sunt obligatorii!');
      return;
    }
    try {
      const res = await api.post (route, {username, password});
      if (method === 'login') {
        localStorage.setItem (ACCESS_TOKEN, res.data.access);
        localStorage.setItem (REFRESH_TOKEN, res.data.refresh);
        await api.get ('/api/users/me/').then (res => {
          setLogedUser (res.data);
        });
        navigate ('/');
      } else {
        navigate ('/login');
      }
    } catch (error) {
      console.error (error);
      if (
        error.response.data.detail ===
        'No active account found with the given credentials'
      ) {
        setErrorMessage ('Datele de access sunt eronate!');
      } else {
        setErrorMessage ('A intervenit o eroare, incerca mai tarziu!');
      }
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        mt: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Utilizator"
        name="email"
        autoComplete="email"
        autoFocus
        value={username}
        onChange={e => setUsername (e.target.value)}
        onFocus={() => setErrorMessage (null)}
        sx={{mb: 2}}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Parola de acces"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword (e.target.value)}
        onFocus={() => setErrorMessage (null)}
        sx={{mb: 2}}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{mt: 3, mb: 2}}
      >
        Conectare
      </Button>
      {errormessage &&
        <Typography color={'red'}>
          {errormessage}
        </Typography>}
    </Box>
  );
}

export default LoginForm;
