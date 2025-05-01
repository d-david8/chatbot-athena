import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  Stack,
  Divider,
} from '@mui/material';
import {useEffect, useState} from 'react';
import useStore from '../../context/Store';
import api from '../../api';

import ChatButtonSettings from './ChatButtonSettings';
import ChatWindowSettings from './ChatWindowSettings';
import HeaderSettings from './HeaderSettings';
import BodySettings from './BodySettings';
import FooterSettings from './FooterSettings';

export default function Widgetwidget () {
  // Global store: widget state, bot info and notifications
  const {widget, setWidget, bot, setNotification} = useStore ();
  const [tab, setTab] = useState (0); // current selected tab

  // Fetch widget settings from API when bot changes
  useEffect (
    () => {
      const fetchData = async () => {
        api
          .get ('/api/chatbot_widget_settings/' + bot.id + '/')
          .then (response => {
            response.name = bot.name;
            setWidget (response.data);
          })
          .catch (() => {
            setNotification ({
              open: true,
              message: 'A intervenit o eroare la aducerea setărilor widget-ului!',
              severity: 'error',
            });
          });
      };
      fetchData ();
    },
    [bot, setNotification, setWidget]
  );

  // Apply widget styles if global applyStyles is available
  useEffect (
    () => {
      if (window.applyStyles) window.applyStyles (widget);
    },
    [widget]
  );

  // Save updated widget settings to the API
  const handleSave = async () => {
    api
      .put (`/api/chatbot_widget_settings/1/`, widget)
      .then (() => {
        setNotification ({
          open: true,
          message: 'Setările widget-ului au fost salvate cu succes!',
          severity: 'success',
        });
      })
      .catch (() => {
        setNotification ({
          open: true,
          message: 'A intervenit o eroare la salvarea setărilor widget-ului!',
          severity: 'error',
        });
      });
  };

  // Handle form input changes
  const handleChange = event => {
    const {name, value} = event.target;
    setWidget ({
      ...widget,
      [name]: value,
    });
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab (newValue);
  };

  return (
    <Box
      sx={{
        padding: 3,
        border: 1,
        borderColor: 'grey.300',
        borderRadius: 2,
        marginBottom: 3,
        alignContent: 'center',
      }}
    >
      {/* Header section: title + save button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">Setări interfață</Typography>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Salvează
        </Button>
      </Box>

      {/* Divider under header */}
      <Divider sx={{margin: '16px 0'}} />

      {/* Tab navigation */}
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Dimensiune fereastră " sx={{textTransform: 'none'}} />
        <Tab label="Antet" sx={{textTransform: 'none'}} />
        <Tab label="Buton chat" sx={{textTransform: 'none'}} />
        <Tab label="Fereastră chat" sx={{textTransform: 'none'}} />
        <Tab label="Subsol" sx={{textTransform: 'none'}} />
      </Tabs>

      {/* Render the selected settings section based on active tab */}
      <Stack
        spacing={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          padding: 3,
        }}
      >
        {tab === 0 &&
          <ChatWindowSettings widget={widget} handleChange={handleChange} />}
        {tab === 1 &&
          <HeaderSettings widget={widget} handleChange={handleChange} />}
        {tab === 2 &&
          <ChatButtonSettings widget={widget} handleChange={handleChange} />}
        {tab === 3 &&
          <BodySettings widget={widget} handleChange={handleChange} />}
        {tab === 4 &&
          <FooterSettings widget={widget} handleChange={handleChange} />}
      </Stack>
    </Box>
  );
}
