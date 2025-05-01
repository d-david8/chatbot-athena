import {useEffect, useState} from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ViewIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import BoltIcon from '@mui/icons-material/Bolt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Notification from '../Notification';
//folder management
import FolderCreate from './FolderCreate';
import FolderDetails from './FolderDetails';
import FolderDelete from './FolderDelete';
import FolderEdit from './FolderEdit';

//document management
import DocumentCreate from './DocumentCreate';
import DocumentDetails from './DocumentDetails';
import DocumentEditDialog from './DocumentEdit';
import DocumentDelete from './DocumentDelete';

//article management
import ArticleDetails from './ArticleDetails';
import ArticleCreate from './ArticleCreate';
import ArticleEdit from './ArticleEdit';
import ArticleDelete from './ArticleDelete';

//advanced search
import SearchArticles from './SearchArticles';

// api
import api from '../../api';

import useStore from '../../context/Store';

export default function SourcesManagement () {
  const {
    //current folder
    selectedFolderId,
    setSelectedFolderId,

    //curent document
    selectedDocumentId,
    setSelectedDocumentId,

    //current articles
    selectedArticleId,
    setSelectedArticleId,

    //list of folders
    folders,
    setFolders,

    //list of documents
    documents,
    setDocuments,

    //list of articles
    articles,
    setArticles,

    //notifications
    notification,
    setNotification,

    //folder management
    openCreateFolderDialog,
    setOpenCreateFolderDialog,

    openViewFolderDialog,
    setOpenViewFolderDialog,

    openUpdateFolderDialog,
    setOpenUpdateFolderDialog,

    openDeleteFolderDialog,
    setOpenDeleteFolderDialog,

    //documents management
    openCreateDocumentDialog,
    setOpenCreateDocumentDialog,

    openViewDocumentDialog,
    setOpenViewDocumentDialog,

    openUpdateDocumentDialog,
    setOpenUpdateDocumentDialog,

    openDeleteDocumentDialog,
    setOpenDeleteDocumentDialog,

    //articles management
    openCreateArticleDialog,
    setOpenCreateArticleDialog,

    openViewArticleDialog,
    setOpenViewArticleDialog,

    openUpdateArticleDialog,
    setOpenUpdateArticleDialog,

    openDeleteArticleDialog,
    setOpenDeleteArticleDialog,
  } = useStore ();

  const [loadingExtract, setLoadingExtract] = useState (false);

  useEffect (
    () => {
      api.get ('/api/folders/').then (response => {
        setFolders (response.data);
      });
    },
    [setFolders, setDocuments, setArticles]
  );

  {
    /*--------------- FOLDERS MANAGEMENT  ---------------*/
  }
  // Create folder
  const handleOpenCreateFolderDialog = () => {
    setOpenCreateFolderDialog (true);
  };
  const handleCloseCreateFolderDialog = () => {
    setOpenCreateFolderDialog (false);
  };

  // Delete folder
  const handleOpenDeleteFolderDialog = folderId => {
    setSelectedFolderId (folderId);
    setOpenDeleteFolderDialog (true);
  };
  const handleCloseDeleteFolderDialog = () => {
    setDocuments ([]);
    setArticles ([]);
    setOpenDeleteFolderDialog (false);
  };

  // View folder details
  const handleOpenViewFolderDetailsDialog = folderId => {
    setSelectedFolderId (folderId);
    setOpenViewFolderDialog (true);
  };
  const handleCloseViewFolderDetailsDialog = () => {
    setOpenViewFolderDialog (false);
  };

  // Edit folder
  const handleOpenEditFolderDialog = folderId => {
    setSelectedFolderId (folderId);
    setOpenUpdateFolderDialog (true);
  };
  const handleCloseEditFolderDialog = () => {
    setOpenUpdateFolderDialog (false);
  };

  // Select folder
  const handleFolderSelect = folderId => {
    setSelectedFolderId (folderId);
    setSelectedDocumentId (null);
    setOpenCreateDocumentDialog (false);
    setDocuments ([]);
    setArticles ([]);
    api.get (`/api/documents/?folder=${folderId}`).then (response => {
      setDocuments (response.data);
    });
  };

  {
    /*--------------- DOCUMENTS MANAGEMENT  ---------------*/
  }

  // Create document
  const handleOpenCreateDocumentDialog = () => {
    if (!selectedFolderId) {
      setNotification ({
        open: true,
        message: 'Selectează o sursă de date înainte de a crea un document!',
        severity: 'warning',
      });
      return;
    }
    setOpenCreateDocumentDialog (true);
  };
  const handleCloseCreateDocumentDialog = () => {
    setOpenCreateDocumentDialog (false);
  };

  // Download document
  const handleDownloadDocument = async (documentId, documentName) => {
    try {
      const response = await api.get (
        `/api/documents/${documentId}/download/`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL (new Blob ([response.data]));
      const link = document.createElement ('a');

      link.href = url;
      link.setAttribute ('download', documentName);

      document.body.appendChild (link);
      link.click ();

      window.URL.revokeObjectURL (url);
      document.body.removeChild (link);
    } catch (error) {
      console.error ('Error downloading document:', error);
      // Show notification
      setNotification ({
        open: true,
        message: 'Eroare la descărcarea documentului!',
        severity: 'error',
      });
    }
  };
  // Extract document
  const handleOpenExtractDocumentDialog = documentId => {
    setLoadingExtract (true);
    api
      .get (`/api/documents/${documentId}/extract/`)
      .then (() => {
        setLoadingExtract (false);
        setNotification ({
          open: true,
          message: 'Documentul a fost extras cu succes!',
          severity: 'success',
        });
      })
      .catch (() => {
        setLoadingExtract (false);
        setNotification ({
          open: true,
          message: 'Eroare la extragerea documentului!',
          severity: 'error',
        });
      });
  };

  // View document details
  const handleOpenViewDocumentDetailsDialog = documentId => {
    setSelectedDocumentId (documentId);
    setOpenViewDocumentDialog (true);
  };
  const handleCloseViewDocumentDetailsDialog = () => {
    setOpenViewDocumentDialog (false);
  };

  // Edit document
  const handleOpenEditDocumentDialog = documentId => {
    setSelectedDocumentId (documentId);
    setOpenUpdateDocumentDialog (true);
  };
  const handleCloseEditDocumentDialog = () => {
    setOpenUpdateDocumentDialog (false);
  };

  // Delete document
  const handleOpenDeleteDocumentDialog = documentId => {
    setSelectedDocumentId (documentId);
    setOpenDeleteDocumentDialog (true);
  };
  const handleCloseDeleteDocumentDialog = () => {
    setArticles ([]);
    setOpenDeleteDocumentDialog (false);
  };

  // Select document
  const handleDocumentSelect = documentId => {
    setSelectedDocumentId (documentId);
    setArticles ([]);
    api.get (`/api/articles/?document_id=${documentId}`).then (response => {
      setArticles (response.data);
    });
  };

  {
    /*--------------- ARTICLES MANAGEMENT  ---------------*/
  }

  // Create article
  const handleOpenCreateArticleDialog = documentId => {
    if (!documentId) {
      setNotification ({
        open: true,
        message: 'Selectează un document înainte de a crea un articol!',
        severity: 'warning',
      });
      return;
    }
    setSelectedDocumentId (documentId);
    setOpenCreateArticleDialog (true);
  };
  const handleCloseCreateArticleDialog = () => {
    setOpenCreateArticleDialog (false);
  };

  // View article details

  const handleOpenViewArticleDialog = articleId => {
    setSelectedArticleId (articleId);
    setOpenViewArticleDialog (true);
  };
  const handleCloseViewArticleDialog = () => {
    setOpenViewArticleDialog (false);
  };

  // Edit article

  const handleOpenEditArticleDialog = articleId => {
    setSelectedArticleId (articleId);
    setOpenUpdateArticleDialog (true);
  };
  const handleCloseEditArticleDialog = () => {
    setOpenUpdateArticleDialog (false);
  };

  // Delete article
  const handleOpenDeleteArticleDialog = articleId => {
    setSelectedArticleId (articleId);
    setOpenDeleteArticleDialog (true);
  };
  const handleCloseDeleteArticleDialog = () => {
    setOpenDeleteArticleDialog (false);
  };

  // Notifications

  const handleNotificationClose = () => {
    setNotification ({...notification, open: false});
  };
  return (
    <Box sx={{height: '100vh'}}>
      <Typography variant="h4" gutterBottom>
        {' '}
        Managementul resurselor
      </Typography>
      <Divider />
      <Typography variant="h4" gutterBottom>
        <SearchArticles />
      </Typography>
      <Divider />

      <Box sx={{display: 'flex', width: '100%', padding: 2}}>
        {/* Lista Foldere */}
        <Box sx={{flex: '0 0 300px', mr: 1, mt: 1, border: 0}}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            Foldere
            <Tooltip title="Creează folder nou" placement="top">
              <IconButton
                size="small"
                onClick={handleOpenCreateFolderDialog}
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <Divider />
          <List sx={{maxHeight: 600, overflowY: 'auto'}}>
            {folders.map (folder => (
              <ListItem
                key={folder.id}
                selected={folder.id === selectedFolderId}
                onClick={() => handleFolderSelect (folder.id)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={folder.name}
                  secondary={
                    folder.created_at !== ''
                      ? folder.created_at.split ('T')[0] +
                          ' ' +
                          folder.created_at.split ('T')[1].split ('.')[0]
                      : 'N/A'
                  }
                />
                <Tooltip title="Vezi detalii folder" placement="top">
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleOpenViewFolderDetailsDialog (folder.id);
                    }}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        color: 'secondary.main',
                      },
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editează folder" placement="top">
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleOpenEditFolderDialog (folder.id);
                    }}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        color: 'secondary.main',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Șterge folder" placement="top">
                  <IconButton
                    size="small"
                    onClick={() => {
                      handleOpenDeleteFolderDialog (folder.id);
                    }}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        color: 'secondary.main',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Lista Documente */}
        <Box sx={{flex: '0 0 300px', mx: 2, padding: 1}}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            Documente
            <Tooltip title="Adaugă document nou" placement="top">
              <IconButton
                size="small"
                onClick={() => handleOpenCreateDocumentDialog ()}
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <Divider />
          <List sx={{maxHeight: 300, overflowY: 'auto'}}>
            {documents.map (document => (
              <ListItem
                key={document.id}
                button={true}
                selected={document.id === selectedDocumentId}
                onClick={() => handleDocumentSelect (document.id)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <DescriptionIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primaryTypographyProps={{
                    sx: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '120px',
                    },
                  }}
                  primary={document.name}
                  secondary={
                    document.created_at !== ''
                      ? document.created_at.split ('T')[0] +
                          ' ' +
                          document.created_at.split ('T')[1].split ('.')[0]
                      : 'N/A'
                  }
                />
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                  <Box sx={{display: 'flex', gap: 1}}>
                    <Tooltip title="Vezi detalii document" placement="top">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleOpenViewDocumentDetailsDialog (document.id)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            color: 'secondary.main',
                          },
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {/*Edit document*/}
                    <Tooltip title="Editează document" placement="top">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleOpenEditDocumentDialog (
                            document.id,
                            document.name
                          )}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            color: 'secondary.main',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {/*Delete document*/}
                    <Tooltip title="Șterge document" placement="top">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleOpenDeleteDocumentDialog (
                            document.id,
                            document.name
                          )}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            color: 'secondary.main',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{display: 'flex', gap: 1}}>
                    {/*Download Document*/}
                    <Tooltip title="Descarcă document" placement="top">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDownloadDocument (document.id, document.name)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            color: 'secondary.main',
                          },
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    {/*Extract Document*/}
                    <Tooltip title="Extrage document" placement="top">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleOpenExtractDocumentDialog (document.id)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            color: 'secondary.main',
                          },
                        }}
                      >
                        {loadingExtract && selectedDocumentId === document.id
                          ? <CircularProgress size={20} />
                          : <BoltIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Lista Articole */}
        <Box sx={{flex: 1, ml: 1, mt: 1}}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            Articole
            <Tooltip title="Adaugă articol nou" placement="top">
              <IconButton
                size="small"
                onClick={() =>
                  handleOpenCreateArticleDialog (selectedDocumentId)}
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Typography>
          <Divider />
          <List sx={{maxHeight: 600, overflowY: 'auto'}}>
            {articles.map (article => (
              <ListItem
                key={article.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <ArticleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={article.title}
                  secondary={
                    article.created_at !== ''
                      ? article.created_at.split ('T')[0] +
                          ' ' +
                          article.created_at.split ('T')[1].split ('.')[0]
                      : 'N/A'
                  }
                />
                <Tooltip title="Vizualizează articol" placement="top">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenViewArticleDialog (article.id)}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        color: 'secondary.main',
                      },
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editează articol" placement="top">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEditArticleDialog (article.id)}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        color: 'secondary.main',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Șterge articol" placement="top">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDeleteArticleDialog (article.id)}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        color: 'secondary.main',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Dialogs for FOLDER MANAGEMENT */}
      {openCreateFolderDialog &&
        <FolderCreate
          open={openCreateFolderDialog}
          onClose={handleCloseCreateFolderDialog}
        />}
      {openDeleteFolderDialog &&
        selectedFolderId &&
        <FolderDelete
          open={openDeleteFolderDialog}
          onClose={handleCloseDeleteFolderDialog}
          folderId={selectedFolderId}
        />}
      {openViewFolderDialog &&
        selectedFolderId &&
        <FolderDetails
          open={openViewFolderDialog}
          onClose={handleCloseViewFolderDetailsDialog}
          folderId={selectedFolderId}
        />}
      {openUpdateFolderDialog &&
        selectedFolderId &&
        <FolderEdit
          open={openUpdateFolderDialog}
          onClose={handleCloseEditFolderDialog}
          folderId={selectedFolderId}
        />}

      {/* Dialogs for DOCUMENTS MANAGEMENT */}
      {openCreateDocumentDialog &&
        selectedFolderId &&
        <DocumentCreate
          open={openCreateDocumentDialog}
          onClose={handleCloseCreateDocumentDialog}
          folderId={selectedFolderId}
        />}
      {openViewDocumentDialog &&
        selectedDocumentId &&
        <DocumentDetails
          open={openViewDocumentDialog}
          onClose={handleCloseViewDocumentDetailsDialog}
          documentId={selectedDocumentId}
        />}
      {openUpdateDocumentDialog &&
        selectedDocumentId &&
        <DocumentEditDialog
          open={openUpdateDocumentDialog}
          onClose={handleCloseEditDocumentDialog}
          documentId={selectedDocumentId}
        />}
      {openDeleteDocumentDialog &&
        selectedDocumentId &&
        <DocumentDelete
          open={openDeleteDocumentDialog}
          onClose={handleCloseDeleteDocumentDialog}
          documentId={selectedDocumentId}
        />}

      {/*--------------- ARTICLES MANAGEMENT  ---------------*/}
      {openCreateArticleDialog &&
        selectedDocumentId &&
        <ArticleCreate
          open={openCreateArticleDialog}
          onClose={handleCloseCreateArticleDialog}
          documentId={selectedDocumentId}
          folderId={selectedFolderId}
        />}
      {openViewArticleDialog &&
        selectedArticleId &&
        <ArticleDetails
          open={openViewArticleDialog}
          onClose={handleCloseViewArticleDialog}
          articleId={selectedArticleId}
        />}
      {openUpdateArticleDialog &&
        selectedArticleId &&
        <ArticleEdit
          open={openUpdateArticleDialog}
          onClose={handleCloseEditArticleDialog}
          articleId={selectedArticleId}
        />}
      {openDeleteArticleDialog &&
        selectedArticleId &&
        <ArticleDelete
          open={openDeleteArticleDialog}
          onClose={handleCloseDeleteArticleDialog}
          articleId={selectedArticleId}
        />}

      {/*NOTIFICATIONS*/}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleNotificationClose}
      />
    </Box>
  );
}
