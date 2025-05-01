// ChatbotNameSettings component is used to modify the name of a chatbot.
import {useEffect} from 'react';
import {Typography, TextField, Button, Box} from '@mui/material';
import api from '../../api';
import useStore from '../../context/Store';

const ChatbotNameSettings = () => {
  // Access global store: bot data, updater and notifications
  const {bot, setBot, setNotification} = useStore ();

  // Fetch current bot info when component mounts
  useEffect (
    () => {
      api
        .get (`/api/bots/${bot.id}/`)
        .then (response => {
          setBot (response.data);
        })
        .catch (() => {
          setNotification ({
            open: true,
            message: 'A intervenit o eroare la aducerea numelui botului!',
            severity: 'error',
          });
        });
    },
    [bot.id, setBot, setNotification]
  );

  // Update local bot name when user types
  const handleNameChange = e => {
    setBot ({...bot, name: e.target.value});
  };

  // Save new bot name to both bot and widget settings
  const handleSave = async () => {
    await api.put (`/api/bots/${bot.id}/`, {
      name: bot.name,
    });

    await api
      .put (`/api/chatbot_widget_settings/${bot.id}/`, {
        name: bot.name,
      })
      .then (() => {
        setNotification ({
          open: true,
          message: 'Numele botului a fost actualizat cu succes!',
          severity: 'success',
        });

        // Apply new settings if applicable
        window.loadNewSettings (bot.bot_id, bot.secret_key);
      })
      .catch (() => {
        setNotification ({
          open: true,
          message: 'A intervenit o eroare la actualizarea numelui botului!',
          severity: 'error',
        });
      });
  };

  return (
    <Box
      sx={{
        padding: 3,
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 2,
        marginBottom: 3,
      }}
    >
      {/* Section title */}
      <Typography variant="h5" gutterBottom>
        Modifică numele chatbotului
      </Typography>

      {/* Input field for bot name */}
      <TextField
        label="Numele chatbotului"
        variant="outlined"
        fullWidth
        sx={{marginTop: 2}}
        value={bot.name}
        onChange={handleNameChange}
      />

      {/* Save button */}
      <Box sx={{marginTop: 2, textAlign: 'right'}}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Salvează
        </Button>
      </Box>
    </Box>
  );
};

export default ChatbotNameSettings;
