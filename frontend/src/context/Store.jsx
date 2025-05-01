import {create} from 'zustand';

const useStore = create (set => ({
  selectedFolderId: null,
  selectedDocumentId: null,
  selectedArticleId: null,
  folders: [],
  documents: [],
  articles: [],

  notification: {
    open: false,
    message: '',
    severity: 'success',
  },

  //folder management
  openCreateFolderDialog: false,
  openViewFolderDialog: false,
  openUpdateFolderDialog: false,
  openDeleteFolderDialog: false,

  //documents management
  openCreateDocumentDialog: false,
  openViewDocumentDialog: false,
  openUpdateDocumentDialog: false,
  openDeleteDocumentDialog: false,

  //articles management
  openCreateArticleDialog: false,
  openViewArticleDialog: false,
  openUpdateArticleDialog: false,
  openDeleteArticleDialog: false,

  //advanced search
  articleId: null,
  openAdvancedSearchDialog: false,

  //bot settings
  bot: {
    id: 1,
    name: '',
    bot_id: '',
    secret_key: '',
  },

  //widget settings
  widget: {
    chat_button_color: '',
    chat_button_text: '',
    chat_button_size: '',
    container_width: '',
    container_height: '',
    header_text: '',
    header_background_color: '',
    header_text_color: '',
    header_font_size: '',
    header_text_align: '',
    body_background_color: '',
    body_text_color: '',
    body_font_size: '',
    body_user_bubble_color: '',
    body_bot_bubble_color: '',
    input_placeholder: '',
    input_text_color: '',
    input_font_size: '',
    send_button_color: '',
    send_button_text: '',
    send_button_font_size: '',
    send_button_text_color: '',
  },

  //openAi settings
  openAISettings: {
    id: 1,
    api_key: '',
    model: '',
    temperature: 0.0,
    max_tokens: 4000,
  },

  promptSettings: {
    id: 1,
    wellcome_message: '',
    company: '',
    domain: '',
    subdomain: '',
    tone: '',
    max_words: 0,
    detail_level: '',
    audience_level: '',
    multi_language: '',
    accept_simple_chat: false,
  },

  setSelectedFolderId: folderId =>
    set ({
      selectedFolderId: folderId,
    }),

  setSelectedDocumentId: documentId =>
    set ({
      selectedDocumentId: documentId,
    }),

  setSelectedArticleId: articleId =>
    set ({
      selectedArticleId: articleId,
    }),

  setFolders: folders =>
    set ({
      folders: folders,
    }),

  setDocuments: documents =>
    set ({
      documents: documents,
    }),

  setArticles: articles =>
    set ({
      articles: articles,
    }),

  //folder management set state
  setOpenCreateFolderDialog: open =>
    set ({
      openCreateFolderDialog: open,
    }),

  setOpenViewFolderDialog: open =>
    set ({
      openViewFolderDialog: open,
    }),

  setOpenUpdateFolderDialog: open =>
    set ({
      openUpdateFolderDialog: open,
    }),

  setOpenDeleteFolderDialog: open =>
    set ({
      openDeleteFolderDialog: open,
    }),

  //documents management set state
  setOpenCreateDocumentDialog: open =>
    set ({
      openCreateDocumentDialog: open,
    }),

  setOpenViewDocumentDialog: open =>
    set ({
      openViewDocumentDialog: open,
    }),

  setOpenUpdateDocumentDialog: open =>
    set ({
      openUpdateDocumentDialog: open,
    }),

  setOpenDeleteDocumentDialog: open =>
    set ({
      openDeleteDocumentDialog: open,
    }),

  //articles management set state
  setOpenCreateArticleDialog: open =>
    set ({
      openCreateArticleDialog: open,
    }),

  setOpenViewArticleDialog: open =>
    set ({
      openViewArticleDialog: open,
    }),

  setOpenUpdateArticleDialog: open =>
    set ({
      openUpdateArticleDialog: open,
    }),

  setOpenDeleteArticleDialog: open =>
    set ({
      openDeleteArticleDialog: open,
    }),

  //advanced search set state

  setArticleId: articleId =>
    set ({
      articleId: articleId,
    }),

  setOpenAdvancedSearchDialog: open =>
    set ({
      openAdvancedSearchDialog: open,
    }),

  //notification set state
  setNotification: ({open, message, severity}) =>
    set (state => ({
      notification: {
        ...state.notification,
        open,
        message,
        severity,
      },
    })),

  //bot settings set state
  setBot: ({id, name, bot_id, secret_key}) =>
    set (state => ({
      bot: {
        ...state.bot,
        id,
        name,
        bot_id,
        secret_key,
      },
    })),

  //widget settings set state
  setWidget: newWidget =>
    set (state => ({widget: {...state.widget, ...newWidget}})),

  //openAi settings set state
  setOpenAISettings: newOpenAiSetting =>
    set (state => ({
      openAISettings: {...state.openAISettings, ...newOpenAiSetting},
    })),
  //prompt settings set state
  setPromptSettings: newPromptSetting =>
    set (state => ({
      promptSettings: {...state.promptSettings, ...newPromptSetting},
    })),
}));

export default useStore;
