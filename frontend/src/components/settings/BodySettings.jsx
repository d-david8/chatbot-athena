// BodySettings component is used to set the body settings of the chat widget.
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Slider,
  TextField,
  Stack,
  Divider,
} from '@mui/material';
import {HexColorPicker} from 'react-colorful';

const BodySettings = ({widget, handleChange}) => {
  // Prevent rendering if widget is not available
  if (!widget) return null;

  return (
    // Main container box with border, spacing and sizing
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
          Setările ferestrei de chat
        </Typography>

        {/* Vertical stack for spacing between sections */}
        <Stack spacing={4}>
          {/* Section for background and text color */}
          <Box
            sx={{
              display: 'flex',
              alignSelf: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {/* Background color input + picker */}
            <Box sx={{flex: 1, maxWidth: 200}}>
              <TextField
                label="Culoarea de fundal"
                value={widget.body_background_color}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'body_background_color',
                      value: event.target.value,
                    },
                  })}
                fullWidth
                margin="dense"
                placeholder="Ex: #ffffff"
                sx={{marginBottom: 2}}
              />
              <Typography
                variant="body1"
                sx={{fontSize: '0.875rem', fontWeight: 400, marginBottom: 1}}
              >
                Selectează o culoare
              </Typography>
              <HexColorPicker
                color={widget.body_background_color}
                onChange={color =>
                  handleChange ({
                    target: {name: 'body_background_color', value: color},
                  })}
              />
            </Box>

            {/* Text color input + picker */}
            <Box sx={{flex: 1, maxWidth: 200}}>
              <TextField
                label="Culoarea textului"
                value={widget.body_text_color}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'body_text_color',
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
                color={widget.body_text_color}
                onChange={color =>
                  handleChange ({
                    target: {name: 'body_text_color', value: color},
                  })}
              />
            </Box>
          </Box>

          <Divider />

          {/* Section for font size */}
          <Box
            sx={{
              padding: '0px 30px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minWidth: 200,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 400,
                marginBottom: '8px',
              }}
            >
              Dimensiunea textului: {widget.body_font_size || '16px'}
            </Typography>
            <Slider
              name="body_font_size"
              value={parseInt (widget.body_font_size) || 16}
              onChange={(event, value) =>
                handleChange ({
                  target: {name: 'body_font_size', value: value + 'px'},
                })}
              min={10}
              max={40}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>

          <Divider />

          {/* Section for user and bot message bubble colors */}
          <Box
            sx={{
              display: 'flex',
              alignSelf: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {/* User bubble color */}
            <Box sx={{flex: 1, maxWidth: 200}}>
              <TextField
                label="Culoarea mesajelor utilizatorului"
                value={widget.body_user_bubble_color}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'body_user_bubble_color',
                      value: event.target.value,
                    },
                  })}
                fullWidth
                margin="dense"
                placeholder="Ex: #d1e7dd"
                sx={{marginBottom: 2}}
              />
              <Typography
                variant="body1"
                sx={{fontSize: '0.875rem', fontWeight: 400, marginBottom: 1}}
              >
                Selectează o culoare
              </Typography>
              <HexColorPicker
                color={widget.body_user_bubble_color}
                onChange={color =>
                  handleChange ({
                    target: {name: 'body_user_bubble_color', value: color},
                  })}
              />
            </Box>

            {/* Bot bubble color */}
            <Box sx={{flex: 1, maxWidth: 200, marginBottom: 2}}>
              <TextField
                label="Culoarea mesajelor chatbotului"
                value={widget.body_bot_bubble_color}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'body_bot_bubble_color',
                      value: event.target.value,
                    },
                  })}
                fullWidth
                margin="dense"
                placeholder="Ex: #f8d7da"
                sx={{marginBottom: 2}}
              />
              <Typography
                variant="body1"
                sx={{fontSize: '0.875rem', fontWeight: 400, marginBottom: 1}}
              >
                Selectează o culoare
              </Typography>
              <HexColorPicker
                color={widget.body_bot_bubble_color}
                onChange={color =>
                  handleChange ({
                    target: {name: 'body_bot_bubble_color', value: color},
                  })}
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    )
  );
};

// Prop type validation
BodySettings.propTypes = {
  widget: PropTypes.shape ({
    body_background_color: PropTypes.string,
    body_text_color: PropTypes.string,
    body_font_size: PropTypes.string,
    body_user_bubble_color: PropTypes.string,
    body_bot_bubble_color: PropTypes.string,
  }),
  handleChange: PropTypes.func,
};

export default BodySettings;
