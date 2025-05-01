import {useEffect, useState} from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import {Pie, Doughnut, Bar} from 'react-chartjs-2';
import api from '../../api';
import useStore from '../../context/Store';

// Register necessary Chart.js components
ChartJS.register (
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const DashboardStats = () => {
  const [stats, setStats] = useState (null);
  const {setNotification} = useStore ();

  // Fetch dashboard statistics from the API on component mount
  useEffect (
    () => {
      api
        .get ('/api/dashboard_stats/')
        .then (response => {
          setStats (response.data);
        })
        .catch (() => {
          setNotification ({
            open: true,
            message: 'A intervenit o eroare la aducerea statisticilor!',
            severity: 'error',
          });
        });
    },
    [setNotification]
  );

  // Show loading spinner while data is being fetched
  if (!stats) {
    return (
      <Box sx={{p: 4, textAlign: 'center'}}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Divider sx={{mb: 4}} />

      {/* General statistics section */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
        }}
      >
        {[
          {
            title: 'Total conversații',
            value: stats.total_conversations || 0,
            color: 'primary',
          },
          {
            title: 'Total mesaje',
            value: stats.total_messages || 0,
            color: 'primary',
          },
          {
            title: 'Conversații cu un singur mesaj',
            value: stats.single_message_conversations || 0,
            color: 'error',
          },
        ].map ((stat, index) => (
          <Card key={index} sx={{flex: 1, minWidth: 250}}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{stat.title}</Typography>
              <Typography variant="h3" color={stat.color}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Divider sx={{my: 4}} />

      {/* Additional statistics section */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
        }}
      >
        {[
          {
            title: 'Nr mediu de mesaje/conversație',
            value: stats.avg_messages_per_conversation || 0,
          },
          {
            title: 'Durata medie a conversațiilor',
            value: stats.avg_duration || '00:00:00',
          },
          {
            title: 'Durata totală a conversațiilor',
            value: stats.total_duration || '00:00:00',
          },
        ].map ((item, index) => (
          <Paper key={index} sx={{flex: 1, minWidth: 250, p: 3}}>
            <Typography variant="h6" gutterBottom>{item.title}</Typography>
            <Typography variant="h3" color="primary">{item.value}</Typography>
          </Paper>
        ))}
      </Box>

      <Divider sx={{my: 4}} />

      {/* Charts section */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
        }}
      >
        {/* Conversation duration distribution chart */}
        <Box sx={{width: '100%', maxWidth: 500}}>
          <Typography variant="h5" gutterBottom>
            Distribuția conversațiilor pe durate
          </Typography>
          <Box sx={{height: 300}}>
            <Pie
              data={{
                labels: Object.keys (stats.conversations_by_duration).map (
                  key =>
                    key === 'under_5_min'
                      ? 'Sub 5 minute'
                      : key === 'between_5_and_10_min'
                          ? '5-10 minute'
                          : 'Peste 10 minute'
                ),
                datasets: [
                  {
                    data: Object.values (stats.conversations_by_duration),
                    backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                  },
                ],
              }}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: context => `${context.raw} conversații`,
                    },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </Box>
        </Box>

        {/* Message distribution chart */}
        <Box sx={{width: '100%', maxWidth: 500}}>
          <Typography variant="h5" gutterBottom>
            Distribuția mesajelor (Chatbot vs User)
          </Typography>
          <Box sx={{height: 300}}>
            <Doughnut
              data={{
                labels: Object.keys (stats.message_distribution).map (
                  key => (key === 'bot' ? 'Chatbot' : 'User')
                ),
                datasets: [
                  {
                    data: Object.values (stats.message_distribution),
                    backgroundColor: ['#4CAF50', '#FFC107'],
                  },
                ],
              }}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: context => `${context.raw} mesaje`,
                    },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{my: 4}} />

      {/* Time-based message distribution bar chart */}
      {stats.temporal_intervals &&
        <Box sx={{width: '100%', maxWidth: 900, mx: 'auto'}}>
          <Typography variant="h5" gutterBottom>
            Distribuția mesajelor pe intervale orare
          </Typography>
          <Box sx={{height: 300}}>
            <Bar
              data={{
                labels: Object.keys (stats.temporal_intervals),
                datasets: [
                  {
                    label: 'Mesaje',
                    data: Object.values (stats.temporal_intervals),
                    backgroundColor: '#2196F3',
                  },
                ],
              }}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: context => `${context.raw} mesaje`,
                    },
                  },
                },
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: {title: {display: true, text: 'Interval Orar'}},
                  y: {title: {display: true, text: 'Număr de Mesaje'}},
                },
              }}
            />
          </Box>
        </Box>}
    </Box>
  );
};

export default DashboardStats;
