from django.urls import path
from . import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Athena API",
        default_version='v1',
        description="Chatbot Athena API",
        terms_of_service="https://www.d-david8.ro/",
        contact=openapi.Contact(email="contact@d-david8.ro"),
        license=openapi.License(name="Athena License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    # Superuser
        path("superusers/", views.SuperUserListCreateView.as_view(), name="superuser-create"),
    # User
    path("users/", views.UserListCreateView.as_view(), name="user-create"),
    path("users/me/", views.UserMeView.as_view(), name="user-me"),
    path("users/<int:pk>/", views.UserDetailView.as_view(), name="user-detail"),
    path("users/<int:pk>/password/", views.UserChangePasswordView.as_view(), name="user-password"),
    path("users/<int:pk>/reset_password/", views.UserResetPasswordView.as_view(), name="user-reset-password"),
    
    # Folder
    path("folders/", views.FolderListCreateView.as_view(), name="folder-list-create"),
    path("folders/<int:pk>/", views.FolderDetailView.as_view(), name="folder-detail"),
    # Document
    path('documents/', views.DocumentListCreateView.as_view(), name='document-list-create'),
    path('documents/<int:pk>/', views.DocumentDetailView.as_view(), name='document-detail'),
    path('documents/<int:pk>/url/', views.DocumentLink.as_view(), name='document-link'),
    path('documents/<int:pk>/extract/', views.DocumentExtractView.as_view(), name='document-extract'),
    path('documents/<int:pk>/download/', views.DocumentDownloadView.as_view(), name='document-download'),
    path('documents?folder=<int:folder>/', views.DocumentListCreateView.as_view(), name='document-list-create'),
    path('documents/<int:pk>/get_text/', views.DocumentGetTextView.as_view(), name='document-get-text'),

    # Article
    path("articles/", views.ArticleListCreateView.as_view(), name="article-list-create"),
    path("articles/<str:pk>/", views.ArticleDetailView.as_view(), name="article-detail"),
    path("advance_search/", views.ArticleAdvancedSearchView.as_view(), name="article-advanced-search"),
    
    # Bot
    path("bots/", views.BotListCreateView.as_view(), name="bot-list-create"),
    path("bots/<int:pk>/", views.BotDetailView.as_view(), name="bot-detail"),

    # OpenAISettings
    path("openaisettings/", views.OpenAISettingsListCreateView.as_view(), name="openaisettings-list-create"),
    path("openaisettings/<int:pk>/", views.OpenAISettingsDetailView.as_view(), name="openaisettings-detail"),
    
    # Chatbot API
    path('chatbot/', views.ChatbotView.as_view(), name='chatbot'),
    path('chatbot_widget/', views.ChatbotWidgetView.as_view(), name='chatbot-widged'),
    path('chatbot_widget/<str:id>/', views.ChatbotWidgetView.as_view(), name='chatbot-widged'),
    path('chatbot_widget_settings/', views.WidgetSettingsListCreateView.as_view(), name='chatbot-widged-settings-list-create'),
    path('chatbot_widget_settings/<str:pk>/', views.WidgetSettingsView.as_view(), name='chatbot-widged-settings-detail'),
    path('chatbot_widget_design/', views.ChatbotWidgetDesignView.as_view(), name='chatbot-widget-design'),
    
    # Conversatui history API
    path('conversations/', views.ConversationListView.as_view(), name='conversation-list-create'),
    path('conversations/<str:pk>/', views.ConversationDetailView.as_view(), name='conversation-detail'),

    # Prompt Settings
    path('prompt_settings/', views.PromptSettingsListCreateView.as_view(), name='prompt-settings-list-create'),
    path('prompt_settings/<int:pk>/', views.PromptSettingsView.as_view(), name='prompt-settings-detail'),

    # Dashboard stats
    path('dashboard_stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    # Swagger and Redoc
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]