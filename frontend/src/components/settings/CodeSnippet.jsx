import {Box, Typography, Button} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {
  materialLight,
  materialDark,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import useStore from '../../context/Store';
import {useThemeContext} from '../../theme/ThemeProviderWrapper';

export default function CodeSnippet () {
  const {darkMode} = useThemeContext ();
  const {setNotification} = useStore ();

  // Codul snippet-ului
  const snippetCode = `
<script>
  (function() {
    var botId = '15a74890-b962-4d39-a31a-7364c2c0f3db';
    var secretKey = 'ddf28dd3-1746-4e32-8f79-387b2aa7aad2';
    var script = document.createElement('script');
    script.src = 'http://127.0.0.1:8000/api/chatbot_widget/?bot_id=' + botId + '&secret_key=' + secretKey;
    script.async = true;
    document.head.appendChild(script);
    script.onload = function() {
        window.loadNewSettings(botId, secretKey);
    };
  })();
</script>
  `;

  // Funcție pentru a copia în clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText (snippetCode);
    setNotification ({
      open: true,
      message: 'Codul pentru integrare a fost copiat în clipboard!',
      severity: 'info',
    });
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        padding: 3,
        border: 1,
        borderColor: 'grey.300',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Cod pentru integrare
      </Typography>

      {/* Syntax Highlighter pentru blocul de cod */}
      <SyntaxHighlighter
        language="javascript"
        style={darkMode ? materialDark : materialLight}
        customStyle={{
          padding: '16px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontFamily: 'Consolas, "Courier New", monospace',
        }}
      >
        {snippetCode}
      </SyntaxHighlighter>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<ContentCopyIcon />}
          onClick={copyToClipboard}
        >
          Copiază
        </Button>
      </Box>
    </Box>
  );
}
