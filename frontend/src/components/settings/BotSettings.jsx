import {TextField, Typography, IconButton, Box, Stack} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useStore from '../../context/Store';

export default function BotSettings () {
  const {bot, setNotification} = useStore ();

  // Copy text to clipboard and show notification
  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText (text);
    setNotification ({
      open: true,
      message: message === 'id'
        ? 'ID-ul botului a fost copiat în clipboard!'
        : 'Cheia secretă a fost copiată în clipboard!',
      severity: 'info',
    });
  };

  return (
    // Main container styled similar to other settings panels
    (
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
          Cheile de acces ale botului
        </Typography>

        {/* Stack for vertical spacing between inputs */}
        <Stack
          spacing={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginTop: 3,
          }}
        >
          {/* Bot ID field with copy button */}
          <TextField
            label="Bot ID"
            value={bot.bot_id}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton onClick={() => copyToClipboard (bot.bot_id, 'id')}>
                  <ContentCopyIcon />
                </IconButton>
              ),
            }}
            fullWidth
          />

          {/* Secret key field with copy button */}
          <TextField
            label="Secret Key"
            value={bot.secret_key}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton
                  onClick={() => copyToClipboard (bot.secret_key, 'key')}
                >
                  <ContentCopyIcon />
                </IconButton>
              ),
            }}
            fullWidth
          />
        </Stack>
      </Box>
    )
  );
}
