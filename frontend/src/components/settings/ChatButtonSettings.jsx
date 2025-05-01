// ChatButtonSettings component is used to render the settings for the chat button in a chatbot widget
import {TextField, Box, Typography, Slider, Stack} from '@mui/material';
import {HexColorPicker} from 'react-colorful';
import PropTypes from 'prop-types';

const ChatButtonSettings = ({widget, handleChange}) => {
  // Prevent rendering if widget is not available
  if (!widget) return null;

  return (
    // Main container with border and spacing
    (
      <Box
        sx={{
          border: 1,
          borderColor: 'grey.300',
          borderRadius: 2,
          padding: 2,
          marginBottom: 4,
          minWidth: '550px',
        }}
      >
        {/* Section title */}
        <Typography variant="h6" gutterBottom>
          Setările butonului de chat
        </Typography>

        {/* Vertical layout wrapper */}
        <Stack spacing={4}>
          {/* Row with settings on the left and color picker on the right */}
          <Box
            sx={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignSelf: 'center',
            }}
          >
            {/* Left column: color text, label, and size slider */}
            <Box sx={{flex: 1, maxWidth: 200}}>
              {/* Input for button color (HEX format) */}
              <TextField
                label="Culoarea butonului"
                name="chat_button_color"
                value={widget.chat_button_color}
                onChange={handleChange}
                fullWidth
                margin="dense"
                placeholder="Ex: #007bff"
                sx={{marginBottom: 2}}
              />

              {/* Input for button text */}
              <TextField
                label="Textul butonului"
                name="chat_button_text"
                value={widget.chat_button_text}
                onChange={handleChange}
                fullWidth
                margin="dense"
                placeholder="Ex: Deschide chat"
                sx={{marginBottom: 2}}
              />

              {/* Label and slider for button size */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  marginBottom: '8px',
                }}
              >
                Dimensiunea butonului: {widget.chat_button_size}
              </Typography>
              <Slider
                name="chat_button_size"
                value={parseInt (widget.chat_button_size) || 40}
                onChange={(event, value) =>
                  handleChange ({
                    target: {
                      name: 'chat_button_size',
                      value: value.toString () + 'px',
                    },
                  })}
                min={20}
                max={100}
                step={5}
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Right column: color picker */}
            <Box sx={{flex: 1, maxWidth: 200, marginBottom: 2}}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  marginBottom: 1,
                }}
              >
                Selectează o culoare
              </Typography>
              <HexColorPicker
                color={widget.chat_button_color}
                onChange={color =>
                  handleChange ({
                    target: {name: 'chat_button_color', value: color},
                  })}
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    )
  );
};

// Define the expected props for the component
ChatButtonSettings.propTypes = {
  widget: PropTypes.shape ({
    chat_button_color: PropTypes.string,
    chat_button_text: PropTypes.string,
    chat_button_size: PropTypes.oneOfType ([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
  handleChange: PropTypes.func,
};

export default ChatButtonSettings;
