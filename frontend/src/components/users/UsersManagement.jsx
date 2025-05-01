import {Fragment, useEffect, useState, useContext} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {
  Button,
  IconButton,
  TextField,
  Box,
  Tooltip,
  Divider,
  Typography,
} from '@mui/material';
import {Delete, Edit, Visibility, Key} from '@mui/icons-material';
import {LogedUserContext} from '../../context/LogedUserContext';
import CreateUserDialog from './CreateUserDialog';
import UserDetailDialog from './UserDetailDialog';
import UserEditDialog from './UserEditDialog';
import ConfirmDeleteUserDialog from './ConfirmDeleteUserDialog';
import ConfirmResetPasswordDialog from './ConfirmResetPasswordDialog';
import Notification from '../Notification';
import api from '../../api';

const UsersManagement = () => {
  const [users, setUsers] = useState ([]);
  const [rows, setRows] = useState ([]);
  const [searchText, setSearchText] = useState ('');
  const [selectedUserId, setSelectedUserId] = useState (null);
  const {logedUser} = useContext (LogedUserContext);
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState (false);
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState (false);
  const [openViewUserDialog, setOpenViewUserDialog] = useState (false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState (false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState (
    false
  );

  const [notification, setNotification] = useState ({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect (() => {
    api
      .get ('/api/users/')
      .then (response => {
        setUsers (response.data);
        setRows (response.data);
      })
      .catch (error => {
        setNotification ({
          open: true,
          message: 'A intervenit o eroare la aducerea datelor!',
          severity: 'error',
        });
        console.error ('Error fetching data:', error);
      });
  }, []);

  useEffect (
    () => {
      const filteredRows = users.filter (
        row =>
          row.username.toLowerCase ().includes (searchText.toLowerCase ()) ||
          row.email.toLowerCase ().includes (searchText.toLowerCase ()) ||
          row.first_name.toLowerCase ().includes (searchText.toLowerCase ()) ||
          row.last_name.toLowerCase ().includes (searchText.toLowerCase ())
      );
      setRows (filteredRows);
    },
    [searchText, users]
  );

  // DELETE USER
  const handleDeleteClick = id => {
    if (id === logedUser.id) {
      setNotification ({
        open: true,
        message: 'Nu poți șterge utilizatorul tau!',
        severity: 'error',
      });
      return;
    }
    setSelectedUserId (id);
    setOpenDeleteUserDialog (true);
  };
  const handleConfirmDelete = () => {
    api
      .delete (`/api/users/${selectedUserId}/`)
      .then (() => {
        setUsers (users.filter (user => user.id !== selectedUserId));
        setOpenDeleteUserDialog (false);
        setSelectedUserId (null);
        setNotification ({
          open: true,
          message: 'Utilizatorul a fost șters cu success!',
          severity: 'success',
        });
      })
      .catch (error => {
        setNotification ({
          open: true,
          message: 'A intervenit o eroare la ștergerea utilizatorului!',
          severity: 'error',
        });
        console.error ('Error deleting user:', error);
      });
  };
  const handleCancelDelete = () => setOpenDeleteUserDialog (false);

  // VIEW USER
  const handleViewClick = id => {
    setSelectedUserId (id);
    setOpenViewUserDialog (true);
  };
  const handleCancelView = () => setOpenViewUserDialog (false);

  // RESET PASSWORD
  const handleResetPasswordClick = id => {
    setSelectedUserId (id);
    setOpenResetPasswordDialog (true);
  };
  const handleConfirmResetPassword = () => {
    api
      .put (`/api/users/${selectedUserId}/reset_password/`)
      .then (() => {
        setOpenResetPasswordDialog (false);
        setNotification ({
          open: true,
          message: 'Parola a fost resetată cu succes!',
          severity: 'success',
        });
      })
      .catch (error => {
        setNotification ({
          open: true,
          message: 'A intervenit o eroare la resetarea parolei!',
          severity: 'error',
        });
        console.error ('Error resetting password:', error);
      });
  };
  const handleCancelResetPassword = () => setOpenResetPasswordDialog (false);

  const getUserById = () => {
    if (!selectedUserId) {
      return {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        is_superuser: false,
        is_active: false,
      };
    }
    return users.find (user => user.id === selectedUserId);
  };

  // SEARCH USER
  const handleSearch = event => {
    setSearchText (event.target.value);
  };

  // CREATE USER
  const handleAddUserClick = () => setOpenCreateUserDialog (true);
  const handleDialogClose = () => setOpenCreateUserDialog (false);

  const handleCreateUser = async userData => {
    try {
      const response = await api.post ('/api/users/', userData);
      setUsers ([...users, response.data]);
      setRows ([...rows, response.data]);
      setOpenCreateUserDialog (false);
      setNotification ({
        open: true,
        message: 'Utilizatorul a fost creat cu succes!',
        severity: 'success',
      });
    } catch (error) {
      const errorMessages = {
        e1: error.response.data.username
          ? 'Nume de utilizator este invalid!'
          : '',
        e2: error.response.data.detail
          ? 'Nu aveți permisiunea necesară pentru a efectua această acțiune!'
          : '',
        e3: 'A intervenit o eroare la crearea utilizatorului!',
      };
      setNotification ({
        open: true,
        message: `${errorMessages.e3} ${errorMessages.e1} ${errorMessages.e2}`,
        severity: 'error',
      });
      throw error;
    }
  };

  // EDIT USER
  const handleEditUserClick = id => {
    setSelectedUserId (id);
    setOpenEditUserDialog (true);
  };
  const handleEditDialogClose = () => setOpenEditUserDialog (false);

  const handleEditUser = async userData => {
    try {
      const response = await api.put (`/api/users/${userData.id}/`, userData);
      const updatedUsers = users.map (
        user => (user.id === userData.id ? response.data : user)
      );
      setUsers (updatedUsers);
      setRows (updatedUsers);
      setOpenEditUserDialog (false);
      setNotification ({
        open: true,
        message: 'Utilizatorul a fost actualizat cu succes!',
        severity: 'success',
      });
    } catch (error) {
      const errorMessages = {
        e1: error.response.data.username
          ? 'Nume de utilizator este invalid!'
          : '',
        e2: error.response.data.detail
          ? 'Nu aveți permisiunea necesară pentru a efectua această acțiune!'
          : '',
        e3: 'A intervenit o eroare la actualizarea utilizatorului!',
      };
      setNotification ({
        open: true,
        message: `${errorMessages.e3} ${errorMessages.e1} ${errorMessages.e2}`,
        severity: 'error',
      });
      throw error;
    }
  };

  const handleNotificationClose = () =>
    setNotification ({...notification, open: false});

  const columns = [
    {field: 'id', headerName: 'ID', width: 90},
    {field: 'first_name', headerName: 'Prenume', width: 150},
    {field: 'last_name', headerName: 'Nume', width: 150},
    {field: 'username', headerName: 'Utilizator', width: 150},
    {field: 'email', headerName: 'Email', width: 200},
    {field: 'is_active', headerName: 'Activ', width: 120, type: 'boolean'},
    {field: 'is_superuser', headerName: 'Admin', width: 120, type: 'boolean'},
    {
      field: 'actions',
      headerName: 'Acțiuni',
      width: 180,
      sortable: false,
      renderCell: params => (
        <Fragment>
          <Tooltip title="Vizualizare" placement="top">
            <IconButton
              sx={{
                color: 'primary.main',
                '&:hover': {
                  color: 'secondary.main',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
              onClick={() => handleViewClick (params.id)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editare" placement="top">
            <span>
              <IconButton
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    color: 'secondary.main',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                disabled={!logedUser.is_superuser}
                onClick={() => handleEditUserClick (params.id)}
              >
                <Edit />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Ștergere" placement="top">
            <span>
              <IconButton
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    color: 'secondary.main',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                disabled={!logedUser.is_superuser}
                onClick={() => handleDeleteClick (params.id)}
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Resetare parolă" placement="top">
            <span>
              <IconButton
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    color: 'secondary.main',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                disabled={!logedUser.is_superuser}
                onClick={() => handleResetPasswordClick (params.id)}
              >
                <Key />
              </IconButton>
            </span>
          </Tooltip>
        </Fragment>
      ),
    },
  ];

  return (
    <Box sx={{height: '100vh'}}>
      <Typography variant="h4" gutterBottom>
        Managementul utilizatorilor
      </Typography>
      <Divider />

      {/* Header controls: search + button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          mb: 3,
        }}
      >
        <TextField
          label="Caută utilizator"
          variant="outlined"
          value={searchText || ''}
          onChange={handleSearch}
          fullWidth
          sx={{maxWidth: '70%'}}
        />
        <Button
          variant="contained"
          onClick={handleAddUserClick}
          disabled={!logedUser.is_superuser}
        >
          Adaugă utilizator
        </Button>
      </Box>

      <Divider />

      {/* Users table */}
      <Box sx={{marginTop: 2, flexGrow: 1}}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </Box>

      {/* Dialogs */}
      <CreateUserDialog
        open={openCreateUserDialog}
        onClose={handleDialogClose}
        onSubmit={handleCreateUser}
      />
      <UserEditDialog
        open={openEditUserDialog}
        onClose={handleEditDialogClose}
        onSubmit={handleEditUser}
        user={getUserById ()}
      />
      <UserDetailDialog
        open={openViewUserDialog}
        onClose={handleCancelView}
        user={getUserById ()}
      />
      <ConfirmDeleteUserDialog
        open={openDeleteUserDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <ConfirmResetPasswordDialog
        open={openResetPasswordDialog}
        onClose={handleCancelResetPassword}
        onConfirm={handleConfirmResetPassword}
      />
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleNotificationClose}
      />
    </Box>
  );
};

export default UsersManagement;
