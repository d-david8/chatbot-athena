// Sidebar.jsx
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import {useContext} from 'react';
import {SelectedItemContext} from '../context/SelectedItemContext';
import useStore from '../context/Store';

const drawerWidth = 200;

const menuItems = [
  {text: 'Utilizatori', icon: <PersonIcon />},
  {text: 'Resurse', icon: <StorageIcon />},
  {text: 'Setări', icon: <SettingsIcon />},
  {text: 'Istoric', icon: <HistoryIcon />},
];

const Sidebar = () => {
  const {selectedItem, setSelectedItem} = useContext (SelectedItemContext);
  const {bot} = useStore ();
  const handleListItemClick = text => {
    setSelectedItem (text);
    window.loadNewSettings (bot.bot_id, bot.secret_key);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
      }}
    >
      <Toolbar />
      <Box sx={{overflow: 'auto'}}>
        <List>
          <ListItem disablePadding onClick={() => handleListItemClick ('Bot')}>
            <ListItemButton
              sx={{
                backgroundColor: selectedItem === 'Bot'
                  ? 'rgba(0, 0, 0, 0.08)'
                  : 'transparent', // Culoarea de fundal când elementul este selectat
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)', // Culoarea de fundal la hover
                },
              }}
            >
              <ListItemIcon>
                <SmartToyIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          {menuItems.map (({text, icon}) => (
            <ListItem
              key={text}
              disablePadding
              onClick={() => handleListItemClick (text)}
            >
              <ListItemButton
                sx={{
                  backgroundColor: selectedItem === text
                    ? 'rgba(0, 0, 0, 0.08)'
                    : 'transparent', // Culoarea de fundal când elementul este selectat
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)', // Culoarea de fundal la hover
                  },
                }}
              >
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
