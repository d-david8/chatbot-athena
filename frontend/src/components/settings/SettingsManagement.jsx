import {useState, useContext} from 'react';
import {Box, Tabs, Tab, Typography, Divider} from '@mui/material';
import useStore from '../../context/Store';

import BotSettings from './BotSettings';
import WidgetSettings from './WidgetSettings';
import Notification from '../Notification';
import OpenAISettings from './OpenAISettings';
import CodeSnippet from './CodeSnippet';
import ChatbotPromptSettings from './ChatbotPromptSettings';
import ChatbotNameSettings from './ChatbotNameSettings';
import {LogedUserContext} from '../../context/LogedUserContext';

// Widget settings tab
function WidgetPage () {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 4,
        flexWrap: 'wrap',
        marginTop: 2, // ensures consistent top spacing
      }}
    >
      <WidgetSettings />
    </Box>
  );
}

// Chatbot prompt + name tab
function ChatbotPage () {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 4,
        flexWrap: 'wrap',
        marginTop: 2, // ensures consistent top spacing
      }}
    >
      {/* Left side */}
      <Box sx={{flex: 1, minWidth: 350, maxWidth: 650}}>
        <ChatbotPromptSettings />
      </Box>

      {/* Right side */}
      <Box sx={{width: 500}}>
        <ChatbotNameSettings />
      </Box>
    </Box>
  );
}

// Advanced settings tab
function AdvancedSettingsPage () {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        marginTop: 2, // consistent top spacing
      }}
    >
      {/* Row 1: Bot + OpenAI */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 4,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{flex: 1, minWidth: 300, maxWidth: 550}}>
          <BotSettings />
        </Box>
        <Box sx={{flex: 1, minWidth: 300, maxWidth: 550}}>
          <OpenAISettings />
        </Box>
      </Box>

      {/* Row 2: Code snippet */}
      <Box sx={{width: '100%'}}>
        <CodeSnippet />
      </Box>
    </Box>
  );
}

// Main component with tabs
export default function SettingsManagement () {
  const {notification, setNotification} = useStore ();
  const [activeTab, setActiveTab] = useState (0);
  const {logedUser} = useContext (LogedUserContext);

  const handleTabChange = (event, newValue) => {
    setActiveTab (newValue);
  };

  const handleNotificationClose = () => {
    setNotification ({...notification, open: false});
  };

  return (
    <Box>
      {/* Page title */}
      <Typography variant="h4" gutterBottom>
        Managementul setărilor
      </Typography>

      <Divider />

      {/* Tab selector */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{marginTop: 2, marginBottom: 2}}
        aria-label="Setari tabs"
      >
        <Tab label="Setări interfață" sx={{textTransform: 'none'}} />
        <Tab label="Setări chatbot" sx={{textTransform: 'none'}} />
        <>
        {logedUser.is_superuser &&
          <Tab label="Setări avansate" sx={{textTransform: 'none'}} />}
        </>
      </Tabs>

      {/* Tab content */}
      <Box sx={{marginLeft: 0}}>
        {activeTab === 0 && <WidgetPage />}
        {activeTab === 1 && <ChatbotPage />}
        {activeTab === 2 && <AdvancedSettingsPage />}
      </Box>

      {/* Global notification */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleNotificationClose}
      />
    </Box>
  );
}
