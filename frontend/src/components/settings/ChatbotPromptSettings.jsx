import {useEffect} from 'react';
import {
  Typography,
  TextField,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import api from '../../api';
import useStore from '../../context/Store';

const ChatbotPromptSettings = () => {
  const {promptSettings, setPromptSettings, setNotification} = useStore ();

  // Fetch settings from API on component mount
  useEffect (
    () => {
      api
        .get ('/api/prompt_settings/1/')
        .then (response => {
          setPromptSettings (response.data);
        })
        .catch (() => {
          setNotification ({
            open: true,
            message: 'A intervenit o eroare la aducerea setărilor!',
            severity: 'error',
          });
        });
    },
    [setNotification, setPromptSettings]
  );

  // Handle input changes and update local state
  const handleChange = e => {
    const {name, value} = e.target;
    setPromptSettings ({
      ...promptSettings,
      [name]: value,
    });
  };

  // Save settings to the backend
  const handleSave = () => {
    api
      .put ('/api/prompt_settings/1/', promptSettings)
      .then (() => {
        setNotification ({
          open: true,
          message: 'Setările au fost actualizate cu succes!',
          severity: 'success',
        });
      })
      .catch (() => {
        setNotification ({
          open: true,
          message: 'A intervenit o eroare la salvarea setărilor!',
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
        Personalizare răspunsuri chatbot
      </Typography>

      {/* Settings form */}
      <Box
        component="form"
        sx={{display: 'flex', flexDirection: 'column', gap: 3}}
        noValidate
        autoComplete="off"
        marginTop={3}
      >
        {/* Welcome message field */}
        <TextField
          label="Mesajul de bun venit"
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          value={promptSettings.wellcome_message}
          name="wellcome_message"
          onChange={handleChange}
        />

        {/* Domain field */}
        <TextField
          label="Compania/Instituția"
          variant="outlined"
          fullWidth
          value={promptSettings.company}
          name="company"
          onChange={handleChange}
        />
        <TextField
          label="Domeniul"
          variant="outlined"
          fullWidth
          value={promptSettings.domain}
          name="domain"
          onChange={handleChange}
        />

        {/* Subdomain field */}
        <TextField
          label="Subdomeniul"
          variant="outlined"
          fullWidth
          value={promptSettings.subdomain}
          name="subdomain"
          onChange={handleChange}
        />

        {/* Tone and max words fields */}
        <Box sx={{display: 'flex', gap: 2}}>
          <FormControl fullWidth>
            <InputLabel>Tonul</InputLabel>
            <Select
              value={promptSettings.tone}
              name="tone"
              label="Tonul"
              onChange={handleChange}
            >
              <MenuItem value="foarte serios">Foarte serios</MenuItem>
              <MenuItem value="serios">Serios</MenuItem>
              <MenuItem value="calm">Calm</MenuItem>
              <MenuItem value="informal">Informal</MenuItem>
              <MenuItem value="amuzant">Amuzant</MenuItem>
              <MenuItem value="neutru">Neutru</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Numarul maxim de cuvinte"
            variant="outlined"
            fullWidth
            value={promptSettings.max_words}
            name="max_words"
            onChange={handleChange}
            type="number"
          />
        </Box>

        {/* Detail level and audience level fields */}
        <Box sx={{display: 'flex', gap: 2}}>
          <FormControl fullWidth>
            <InputLabel>Nivelul de detaliu</InputLabel>
            <Select
              value={promptSettings.detail_level}
              name="detail_level"
              label="Nivelul de detaliu"
              onChange={handleChange}
            >
              <MenuItem value="minimal">Minimal</MenuItem>
              <MenuItem value="mediu">Mediu</MenuItem>
              <MenuItem value="detaliat">Detaliat</MenuItem>
              <MenuItem value="avansat">Avansat</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Experiența utilizatorului</InputLabel>
            <Select
              value={promptSettings.audience_level}
              name="audience_level"
              label="Experiența utilizatorului"
              onChange={handleChange}
            >
              <MenuItem value="începator">Începător</MenuItem>
              <MenuItem value="intermediar">Intermediar</MenuItem>
              <MenuItem value="avansat">Avansat</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Language selection - multiple values */}
        <Autocomplete
          multiple
          options={['engleză', 'română', 'franceză', 'spaniolă', 'germană']}
          value={
            promptSettings.multi_language
              ? promptSettings.multi_language
                  .split (',')
                  .filter (lang =>
                    [
                      'engleză',
                      'română',
                      'franceză',
                      'spaniolă',
                      'germană',
                    ].includes (lang)
                  )
              : []
          }
          onChange={(event, newValue) => {
            setPromptSettings ({
              ...promptSettings,
              multi_language: newValue.join (','),
            });
            console.log (newValue);
          }}
          renderInput={params => (
            <TextField
              {...params}
              label="Limbi de răspuns"
              variant="outlined"
            />
          )}
        />

        {/* Checkbox for accepting simple chat mode */}
        <FormControlLabel
          control={
            <Checkbox
              checked={promptSettings.accept_simple_chat}
              onChange={e => {
                setPromptSettings ({
                  ...promptSettings,
                  accept_simple_chat: e.target.checked,
                });
              }}
            />
          }
          label="Acceptă chat simplu"
        />

        {/* Save button */}
        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSave ()}
          >
            Salvează
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatbotPromptSettings;
