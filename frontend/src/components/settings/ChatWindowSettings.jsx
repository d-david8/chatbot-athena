// ChatWindowSettings component is used to set the size of the chat window
import {Box, Typography, Slider, Stack} from '@mui/material';
import PropTypes from 'prop-types';

const ChatWindowSettings = ({widget, handleChange}) => {
  // Prevent rendering if widget is not available
  if (!widget) return null;
  return (
    // Outer container with border, padding, and styling
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
          Dimensiunea ferestrei de chat
        </Typography>

        {/* Vertical layout for the sliders */}
        <Stack spacing={2}>
          {/* Slider for chat window width */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 12px',
            }}
          >
            {/* Label for width */}
            <Typography
              variant="body1"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 400,
                marginBottom: '8px',
              }}
            >
              Lățimea ferestrei: {widget.container_width}
            </Typography>

            {/* Width slider */}
            <Slider
              name="container_width"
              value={parseInt (widget.container_width) || 300}
              onChange={(event, value) =>
                handleChange ({
                  target: {
                    name: 'container_width',
                    value: value.toString () + 'px',
                  },
                })}
              min={250}
              max={1000}
              step={10}
              valueLabelDisplay="auto"
              sx={{width: '100%'}}
            />
          </Box>

          {/* Slider for chat window height */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '8px 12px',
            }}
          >
            {/* Label for height */}
            <Typography
              variant="body1"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 400,
                marginBottom: '8px',
              }}
            >
              Înălțimea ferestrei: {widget.container_height}
            </Typography>

            {/* Height slider */}
            <Slider
              name="container_height"
              value={parseInt (widget.container_height) || 400}
              onChange={(event, value) =>
                handleChange ({
                  target: {
                    name: 'container_height',
                    value: value.toString () + 'px',
                  },
                })}
              min={250}
              max={1000}
              step={10}
              valueLabelDisplay="auto"
              sx={{width: '100%'}}
            />
          </Box>
        </Stack>
      </Box>
    )
  );
};

// Props validation
ChatWindowSettings.propTypes = {
  widget: PropTypes.shape ({
    container_width: PropTypes.string,
    container_height: PropTypes.string,
  }),
  handleChange: PropTypes.func,
};

export default ChatWindowSettings;
