import {useContext} from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {SelectedItemContext} from '../context/SelectedItemContext';
import UsersManagement from '../components/users/UsersManagement';
import SourcesManagement from './sources/SourcesManagement';
import DashboardStats from './dashboard/DashboardStats';
import SettingsManagement from './settings/SettingsManagement';
import ConversationHistory from './history/ConversationHistory';

const MainContent = () => {
  const {selectedItem} = useContext (SelectedItemContext);
  const menu = {
    Bot: <DashboardStats />,
    Utilizatori: <UsersManagement />,
    Resurse: <SourcesManagement />,
    Setări: <SettingsManagement />,
    Istoric: <ConversationHistory />,
  };

  return (
    <Box component="main" sx={{flexGrow: 1, p: 3, mt: -1}}>
      <Toolbar />
      {menu[selectedItem]}
    </Box>
  );
};

export default MainContent;
