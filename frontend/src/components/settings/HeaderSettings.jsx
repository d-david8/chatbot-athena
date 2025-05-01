// HeaderSettings component is used to set the header settings of the widget
import {
  Box,
  Typography,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Stack,
} from '@mui/material';
import PropTypes from 'prop-types';
import {HexColorPicker} from 'react-colorful';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';

const HeaderSettings = ({widget, handleChange}) => {
  // Prevent rendering if widget is not available
  if (!widget) return null;
  return (
    // Main container box with border and padding
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
          Setările antetului
        </Typography>

        {/* Vertical stack to organize layout spacing */}
        <Stack spacing={4}>
          {/* First row: background color and text color pickers */}
          <Box
            sx={{
              display: 'flex',
              alignSelf: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {/* Background color settings */}
            <Box sx={{flex: 1, maxWidth: 200}}>
              <TextField
                label="Culoarea de fundal"
                value={widget.header_background_color}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'header_background_color',
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
                color={widget.header_background_color}
                onChange={color =>
                  handleChange ({
                    target: {name: 'header_background_color', value: color},
                  })}
              />
            </Box>

            {/* Text color settings */}
            <Box sx={{flex: 1, maxWidth: 200}}>
              <TextField
                label="Culoarea textului"
                value={widget.header_text_color}
                onChange={event =>
                  handleChange ({
                    target: {
                      name: 'header_text_color',
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
                color={widget.header_text_color}
                onChange={color =>
                  handleChange ({
                    target: {name: 'header_text_color', value: color},
                  })}
              />
            </Box>
          </Box>

          {/* Second row: font size and text alignment */}
          <Box
            sx={{
              display: 'flex',
              alignSelf: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {/* Font size settings */}
            <Box sx={{flex: 1, width: 200}}>
              <Typography
                gutterBottom
                variant="body1"
                sx={{fontSize: '0.875rem', fontWeight: 400}}
              >
                Dimensiunea textului: {widget.header_font_size}
              </Typography>
              <Slider
                name="header_font_size"
                value={parseInt (widget.header_font_size) || 16}
                onChange={(event, value) =>
                  handleChange ({
                    target: {name: 'header_font_size', value: value + 'px'},
                  })}
                min={12}
                max={50}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Text alignment buttons */}
            <Box
              sx={{
                flex: 1,
                width: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  marginBottom: '12px',
                }}
              >
                Alinierea textului
              </Typography>
              <ToggleButtonGroup
                value={widget.header_text_align}
                exclusive
                onChange={(event, value) => {
                  if (value !== null) {
                    handleChange ({
                      target: {name: 'header_text_align', value},
                    });
                  }
                }}
                aria-label="text alignment"
              >
                <ToggleButton value="left" aria-label="left aligned">
                  <FormatAlignLeftIcon />
                </ToggleButton>
                <ToggleButton value="center" aria-label="centered">
                  <FormatAlignCenterIcon />
                </ToggleButton>
                <ToggleButton value="right" aria-label="right aligned">
                  <FormatAlignRightIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Stack>
      </Box>
    )
  );
};

// Define prop types for validation
HeaderSettings.propTypes = {
  widget: PropTypes.shape ({
    header_background_color: PropTypes.string,
    header_text_color: PropTypes.string,
    header_font_size: PropTypes.string,
    header_text_align: PropTypes.string,
  }),
  handleChange: PropTypes.func,
};
export default HeaderSettings;
