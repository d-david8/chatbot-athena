import {useState, useEffect, useCallback} from 'react';

// Shared configuration for TextField components
const sharedTextFieldProps = {
  variant: 'outlined',
  slotProps: {inputLabel: {shrink: true}},
};

import {
  Box,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

import dayjs from 'dayjs';
import api from '../../api';
import 'dayjs/locale/ro';

const ConversationHistory = () => {
  // State for filters
  const [startDate, setStartDate] = useState (() =>
    dayjs ().subtract (1, 'day')
  );
  const [endDate, setEndDate] = useState (() => dayjs ());
  const [conversationId, setConversationId] = useState ('');
  const [searchKeyword, setSearchKeyword] = useState ('');

  // State for results
  const [conversations, setConversations] = useState ([]);
  const [expandedConversation, setExpandedConversation] = useState (null);
  const [messages, setMessages] = useState ({});
  const [loading, setLoading] = useState (false);

  // Fetch conversations based on filters
  const fetchConversations = useCallback (
    async () => {
      setLoading (true);
      let queryParams = '';

      // Add filters to query string
      if (startDate)
        queryParams += `start=${startDate.toISOString ().substring (0, 19)}&`;
      if (endDate)
        queryParams += `end=${endDate.toISOString ().substring (0, 19)}&`;
      if (conversationId) queryParams += `conversation_id=${conversationId}&`;
      if (searchKeyword) queryParams += `search=${searchKeyword}&`;

      queryParams = queryParams.slice (0, -1); // Remove trailing &

      try {
        const response = await api.get (`/api/conversations/?${queryParams}`);
        setConversations (response.data);
      } catch (error) {
        console.error ('Error fetching conversations:', error);
      } finally {
        setLoading (false);
      }
    },
    [conversationId, endDate, searchKeyword, startDate]
  );

  // Reset all filters to default values
  const resetFilters = () => {
    const defaultStart = dayjs ().subtract (7, 'day');
    const defaultEnd = dayjs ();
    setStartDate (defaultStart);
    setEndDate (defaultEnd);
    setConversationId ('');
    setSearchKeyword ('');
    setTimeout (() => {
      fetchConversations ();
    }, 0);
  };

  // Handle expansion of a conversation accordion
  const handleExpand = async conversationId => {
    if (expandedConversation === conversationId) {
      setExpandedConversation (null);
    } else {
      setExpandedConversation (conversationId);
      if (!messages[conversationId]) {
        try {
          const response = await api.get (
            `/api/conversations/${conversationId}/`
          );
          setMessages (prev => ({
            ...prev,
            [conversationId]: response.data.messages,
          }));
        } catch (error) {
          console.error (
            `Error fetching messages for ${conversationId}:`,
            error
          );
        }
      }
    }
  };

  // Fetch initial conversations on mount
  useEffect (() => {
    fetchConversations ();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{height: '100%', paddingBottom: 6}}>
      <Typography variant="h4" gutterBottom>
        Istoricul conversațiilor
      </Typography>
      <Divider />

      {/* Filter Section */}
      <Box sx={{marginTop: 4}}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 2,
            gap: 2,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ro">
            {/* Start date picker */}
            <DateTimePicker
              label="Data și ora de început"
              format="DD/MM/YYYY HH:mm:ss"
              value={startDate}
              onChange={newValue => {
                if (newValue) setStartDate (newValue);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  InputLabelProps: {shrink: true},
                  sx: {minWidth: 280},
                },
              }}
            />

            {/* End date picker */}
            <DateTimePicker
              label="Data și ora de sfârșit"
              format="DD/MM/YYYY HH:mm:ss"
              value={endDate}
              onChange={newValue => {
                if (newValue) setEndDate (newValue);
              }}
              minDateTime={startDate}
              maxDateTime={dayjs ()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  InputLabelProps: {shrink: true},
                  sx: {minWidth: 280},
                },
              }}
            />

            {/* Text filters */}
            <TextField
              label="ID Conversație"
              value={conversationId}
              onChange={e => setConversationId (e.target.value)}
              fullWidth
              variant="outlined"
              {...sharedTextFieldProps}
              sx={{minWidth: 220}}
            />
            <TextField
              label="Cuvânt cheie"
              value={searchKeyword}
              onChange={e => setSearchKeyword (e.target.value)}
              fullWidth
              variant="outlined"
              {...sharedTextFieldProps}
              sx={{minWidth: 220}}
            />
          </LocalizationProvider>
        </Box>

        {/* Filter buttons */}
        <Box sx={{display: 'flex', gap: 2, marginBottom: 2}}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchConversations}
            disabled={loading}
          >
            {loading ? 'Încarcă...' : 'Aplică filtrele'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={resetFilters}
            disabled={loading}
          >
            Resetează filtrele
          </Button>
        </Box>
      </Box>

      {/* Results Section */}
      <Box sx={{marginTop: 4}}>
        {loading
          ? <CircularProgress />
          : conversations.length === 0
              ? <Typography>Nu au fost găsite conversații.</Typography>
              : conversations.map (conv => (
                  <Accordion
                    key={conv.conversation_id}
                    expanded={expandedConversation === conv.conversation_id}
                    onChange={() => handleExpand (conv.conversation_id)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${conv.conversation_id}-content`}
                      id={`${conv.conversation_id}-header`}
                    >
                      <Box sx={{flexGrow: 1}}>
                        <Typography variant="h6">
                          {(conv.first_user_message &&
                            conv.first_user_message.content) ||
                            'Fără mesaj'}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{userSelect: 'text'}}
                        >
                          ID Conversație: {conv.conversation_id}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {dayjs (conv.created_at).format ('YYYY-MM-DD HH:mm:ss')}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      {messages[conv.conversation_id]
                        ? <List>
                            {messages[
                              conv.conversation_id
                            ].map ((msg, index) => (
                              <ListItem key={index}>
                                <ListItemText
                                  primary={
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                      }}
                                    >
                                      {/* Sender Icon */}
                                      {msg.sender === 'bot'
                                        ? <SmartToyIcon
                                            fontSize="small"
                                            color="primary"
                                          />
                                        : <PersonIcon
                                            fontSize="small"
                                            color="secondary"
                                          />}
                                      {/* Message content */}
                                      <Typography component="span">
                                        {msg.content}
                                      </Typography>
                                    </Box>
                                  }
                                  secondary={dayjs (msg.timestamp).format (
                                    'YYYY-MM-DD HH:mm:ss'
                                  )}
                                />
                              </ListItem>
                            ))}
                          </List>
                        : <CircularProgress />}
                    </AccordionDetails>

                  </Accordion>
                ))}
      </Box>
    </Box>
  );
};

export default ConversationHistory;
