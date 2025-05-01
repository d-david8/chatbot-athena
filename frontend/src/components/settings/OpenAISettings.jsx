import {useEffect} from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Slider,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import api from '../../api';
import useStore from '../../context/Store';

const OpenAISettings = () => {
  const {bot, openAISettings, setOpenAISettings, setNotification} = useStore ();

  useEffect (
    () => {
      const getOpenAISettings = async () => {
        api
          .get ('/api/openaisettings/?bot=' + bot.id)
          .then (response => {
            const data = response.data[0];
            setOpenAISettings ({
              id: data.id,
              bot: data.bot,
              model: data.model,
              api_key: data.api_key,
              max_tokens: data.max_tokens,
              temperature: data.temperature,
            });
          })
          .catch (() => {
            setNotification ({
              open: true,
              message: 'A intervenit o eroare la aducerea setărilor OpenAI!',
              severity: 'error',
            });
          });
      };
      getOpenAISettings ();
    },
    [setOpenAISettings, bot, setNotification]
  );

  const handleChange = event => {
    const {name, value} = event.target;
    setOpenAISettings ({
      ...openAISettings,
      [name]: value,
    });
  };

  const handleSave = async () => {
    api
      .put (`/api/openaisettings/${openAISettings.id}/`, openAISettings)
      .then (() => {
        setNotification ({
          open: true,
          message: 'Setările OpenAI au fost salvate cu succes!',
          severity: 'success',
        });
      })
      .catch (() => {
        setNotification ({
          open: true,
          message: 'A intervenit o eroare la salvarea setărilor OpenAI!',
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
        minWidth: 300,
      }}
    >
      {/* Title */}
      <Typography variant="h6" gutterBottom>
        Setări OpenAI
      </Typography>

      {/* Model + Max Tokens on same line */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          marginBottom: 3,
        }}
      >
        <FormControl fullWidth margin="dense">
          <InputLabel id="model-label">Model</InputLabel>
          <Select
            labelId="model-label"
            name="model"
            value={openAISettings.model}
            onChange={handleChange}
            label="Model"
          >
            <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
            <MenuItem value="gpt-4">gpt-4</MenuItem>
            <MenuItem value="gpt-4-turbo">gpt-4-turbo</MenuItem>
            <MenuItem value="gpt-4o">gpt-4o</MenuItem>
            <MenuItem value="gpt-4o-mini">gpt-4o-mini</MenuItem>
            <MenuItem value="gpt-4.5-preview">gpt-4.5-preview</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Max Tokens"
          name="max_tokens"
          type="number"
          value={openAISettings.max_tokens}
          onChange={handleChange}
          fullWidth
          margin="dense"
          placeholder="Introduceți numărul maxim de tokens"
          inputProps={{min: 1, max: 4000}}
        />
      </Box>

      {/* API Key input */}
      <Box sx={{marginBottom: 3}}>
        <TextField
          label="API Key"
          name="api_key"
          value={openAISettings.api_key}
          onChange={handleChange}
          fullWidth
          margin="dense"
          placeholder="Introduceți API Key"
        />
      </Box>

      {/* Temperature slider */}
      <Box sx={{minWidth: 250, maxWidth: 500}}>
        <Typography
          gutterBottom
          sx={{
            fontSize: '0.875rem',
            fontWeight: 400,

            marginBottom: '8px',
          }}
        >
          Temperatura: {openAISettings.temperature}
        </Typography>
        <Slider
          name="temperature"
          value={parseFloat (openAISettings.temperature) || 0}
          onChange={(event, value) =>
            handleChange ({
              target: {name: 'temperature', value: value},
            })}
          min={0}
          max={2}
          step={0.1}
          valueLabelDisplay="auto"
        />
      </Box>

      {/* Save Button */}
      <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: 3}}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Salvează
        </Button>
      </Box>
    </Box>
  );
};

export default OpenAISettings;
