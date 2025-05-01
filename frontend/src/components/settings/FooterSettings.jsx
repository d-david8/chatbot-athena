//FooterSettings component is used to manage the settings of the footer of a chatbot widget.
import PropTypes from 'prop-types';
import {Box, Typography, TextField, Slider, Stack} from '@mui/material';
import {HexColorPicker} from 'react-colorful';

const FooterSettings = ({widget, handleChange}) => {
  // Prevent rendering if widget is not available
  if (!widget) return null;

  return (
    // Outer container with border, padding, and min width
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
          Setările subsolului
        </Typography>

        {/* Stack to manage vertical spacing */}
        <Stack spacing={4}>
          {/* Two-column layout for footer settings */}
          <Box
            sx={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignSelf: 'center',
            }}
          >
            {/* Left column */}
            <Box sx={{flex: 1, maxWidth: 200}}>
              {/* Input placeholder text */}
              <TextField
                label="Textul sugestiv"
                value={widget.input_placeholder}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'input_placeholder',
                      value: event.target.value,
                    },
                  })}
                fullWidth
                margin="dense"
                placeholder="Introduceți textul pentru placeholder"
                sx={{marginBottom: 2}}
              />

              {/* Slider for input font size */}
              <Typography
                variant="body1"
                sx={{fontSize: '0.875rem', fontWeight: 400, marginBottom: 1}}
              >
                Dimensiune text: {widget.input_font_size || '16px'}
              </Typography>
              <Slider
                name="input_font_size"
                value={parseInt (widget.input_font_size) || 16}
                onChange={(event, value) =>
                  handleChange ({
                    target: {name: 'input_font_size', value: value + 'px'},
                  })}
                min={10}
                max={40}
                step={1}
                valueLabelDisplay="auto"
                sx={{marginBottom: 2}}
              />

              {/* Send button text input */}
              <TextField
                label="Text buton trimitere"
                value={widget.send_button_text}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'send_button_text',
                      value: event.target.value,
                    },
                  })}
                fullWidth
                margin="dense"
                placeholder="Introduceți textul butonului"
                sx={{marginTop: 2, marginBottom: 2}}
              />

              {/* Slider for send button font size */}
              <Typography
                variant="body1"
                sx={{fontSize: '0.875rem', fontWeight: 400, marginBottom: 1}}
              >
                Dimensiune text buton: {widget.send_button_font_size || '16px'}
              </Typography>
              <Slider
                name="send_button_font_size"
                value={parseInt (widget.send_button_font_size) || 16}
                onChange={(event, value) =>
                  handleChange ({
                    target: {
                      name: 'send_button_font_size',
                      value: value + 'px',
                    },
                  })}
                min={10}
                max={40}
                step={1}
                valueLabelDisplay="auto"
                sx={{marginBottom: 1}}
              />

              {/* Send button text color + picker */}
              <TextField
                label="Culoare text buton"
                value={widget.send_button_text_color}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'send_button_text_color',
                      value: event.target.value,
                    },
                  })}
                fullWidth
                margin="dense"
                placeholder="Ex: #ffffff"
                sx={{marginTop: 2, marginBottom: 2}}
              />
              <Typography
                variant="body1"
                sx={{fontSize: '0.875rem', fontWeight: 400, marginBottom: 1}}
              >
                Selectează o culoare
              </Typography>
              <HexColorPicker
                color={widget.send_button_text_color}
                onChange={color =>
                  handleChange ({
                    target: {name: 'send_button_text_color', value: color},
                  })}
              />
            </Box>

            {/* Right column */}
            <Box sx={{flex: 1, maxWidth: 200, marginBottom: 2}}>
              {/* Input text color + picker */}
              <TextField
                label="Culoarea textului"
                value={widget.input_text_color}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'input_text_color',
                      value: event.target.value,
                    },
                  })}
                fullWidth
                margin="dense"
                placeholder="Ex: #000000"
                sx={{marginBottom: 2}}
              />
              <Typography
                variant="body1"
                sx={{fontSize: '0.875rem', fontWeight: 400, marginBottom: 1}}
              >
                Selectează o culoare
              </Typography>
              <HexColorPicker
                color={widget.input_text_color}
                onChange={color =>
                  handleChange ({
                    target: {name: 'input_text_color', value: color},
                  })}
              />

              {/* Send button background color + picker */}
              <TextField
                label="Culoare buton trimitere"
                value={widget.send_button_color}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'send_button_color',
                      value: event.target.value,
                    },
                  })}
                fullWidth
                margin="dense"
                placeholder="Ex: #007bff"
                sx={{marginTop: 4, marginBottom: 2}}
              />
              <Typography
                variant="body1"
                sx={{fontSize: '0.875rem', fontWeight: 400, marginBottom: 1}}
              >
                Selectează o culoare
              </Typography>
              <HexColorPicker
                color={widget.send_button_color}
                onChange={color =>
                  handleChange ({
                    target: {name: 'send_button_color', value: color},
                  })}
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    )
  );
};

// Define prop types for validation
FooterSettings.propTypes = {
  widget: PropTypes.shape ({
    input_placeholder: PropTypes.string,
    input_text_color: PropTypes.string,
    input_font_size: PropTypes.string,
    send_button_color: PropTypes.string,
    send_button_text: PropTypes.string,
    send_button_font_size: PropTypes.string,
    send_button_text_color: PropTypes.string,
  }),
  handleChange: PropTypes.func.isRequired,
};

export default FooterSettings;
