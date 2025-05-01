// Home.js
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import {useThemeContext} from '../theme/ThemeProviderWrapper';
import {SelectedItemProvider} from '../context/SelectedItemContext';
import useStore from '../context/Store';
import {useEffect, useContext} from 'react';
import api from '../api';
import {Person} from '@mui/icons-material';
import {useState} from 'react';
import UserProfileDialog from '../components/users/UserProfileDialog';
import Tooltip from '@mui/material/Tooltip';
import {LogedUserContext} from '../context/LogedUserContext';

const Home = () => {
  const {darkMode, toggleTheme} = useThemeContext ();

  const [openProfile, setOpenProfile] = useState (false);

  const {bot, setBot} = useStore ();

  const {logedUser} = useContext (LogedUserContext);

  // get the bot_id and secret_key from the backend
  useEffect (
    () => {
      const getBotCredentials = async () => {
        try {
          const response = await api.get ('/api/bots/1/');
          setBot ({
            id: response.data.id,
            name: response.data.name,
            bot_id: response.data.bot_id,
            secret_key: response.data.secret_key,
          });
        } catch (error) {
          console.error ('Error fetching bot credentials:', error);
        }
      };
      getBotCredentials ();
    },
    [setBot]
  );

  // load the chatbot widget
  useEffect (
    () => {
      const script = document.createElement ('script');
      script.src =
        'http://127.0.0.1:8000/api/chatbot_widget/?bot_id=' +
        bot.bot_id +
        '&secret_key=' +
        bot.secret_key;
      script.async = true;
      document.body.appendChild (script);
      script.onload = function () {
        window.loadNewSettings (bot.bot_id, bot.secret_key);
      };

      return () => {
        document.body.removeChild (script);
      };
    },
    [bot.bot_id, bot.secret_key]
  );

  return (
    <SelectedItemProvider>
      <Box sx={{display: 'flex'}}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{zIndex: theme => theme.zIndex.drawer + 1}}
        >
          <Toolbar>
            <Box sx={{display: 'flex', alignItems: 'center', flexGrow: 1}}>
              <img
                src="/src/assets/logo.png"
                alt="Athena Logo"
                style={{height: '60px', width: 'auto', marginRight: '10px'}}
              />
              <Typography variant="h6" noWrap component="div">
                Athena
              </Typography>
            </Box>
            <Typography sx={{mr: 2}}>
              Bun venit, {logedUser.first_name}!
            </Typography>
            <Tooltip title="Prolilul meu">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                sx={{mr: 2}}
                onClick={() => setOpenProfile (true)}
              >
                <Person />
              </IconButton>
            </Tooltip>
            <Tooltip title="Shimbă tema">
              <IconButton
                color="inherit"
                aria-label="toggle theme"
                onClick={toggleTheme}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Deconectare">

              <IconButton
                color="inherit"
                onClick={() => {
                  localStorage.removeItem ('access');
                  localStorage.removeItem ('refresh');
                  localStorage.removeItem ('logetUser');
                  localStorage.setItem ('selectedItem', 'Bot');
                  localStorage.removeItem ('logedUser');
                  window.location.reload ();
                  // Redirect to login page
                  window.location.href = '/login';
                }}
                sx={{marginLeft: '10px'}}
                aria-label="logout"
                size="large"
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Sidebar />
        <MainContent />
        <UserProfileDialog
          open={openProfile}
          onClose={() => setOpenProfile (false)}
        />
      </Box>
    </SelectedItemProvider>
  );
};

export default Home;
