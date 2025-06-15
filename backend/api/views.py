from asyncio import log
from datetime import datetime
import os
import uuid
from uuid import uuid4
from bson import ObjectId
from django.contrib.auth.models import User
from rest_framework import generics

from django.conf import settings
from django.db.models import Min, Max, Q, Sum, Count, ExpressionWrapper, F, DurationField, Avg
from django.db.models.functions import Cast, ExtractHour
from .serializers import ArticleSearchSerializer, MessageSerializer, OpenAISettingsSerializer, UserSerializer, FolderSerializer, DocumentSerializer, BotSerializer, ArticleSerializer, WidgetSettingsSerializer, PromptSettingsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.status import *
from .models import OpenAISettings, Folder, Document, Bot, Article, Message, Conversation, WidgetSettings, PromptSettings
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from .filters import DocumentsFilter, OpenAISettingsFilter
from rest_framework.views import APIView
from django.http import FileResponse, Http404, HttpResponse
from .utils.mongodb_utils import MongoDBUtils
from .utils.open_ai_utils import OpenAIUtils
from datetime import timedelta
from .utils.email_utils import EmailUtils
from .utils.password_utils import PasswordUtils

# User

class SuperUserListCreateView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(is_superuser=True)

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_superuser: 
            raise PermissionDenied("You do not have permission to create users.")
        serializer.save()

class UserMeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs.get('pk')
        return generics.get_object_or_404(User, id=user_id)

class UserChangePasswordView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        if not user.check_password(request.data['old_password']):
            return Response({'error': 'Old password is incorrect'}, status=400)
        user.set_password(request.data['new_password'])
        user.save()
        return Response({'message': 'Password changed successfully'}, status=200)

class UserResetPasswordView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        new_password = PasswordUtils.generate_random_password()
        EmailUtils.send_reset_password_email(user.first_name, user.email, new_password)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reseted successfully'}, status=200)

#Folder
class FolderListCreateView(generics.ListCreateAPIView):
    queryset = Folder.objects.all().order_by('created_at')
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class FolderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        folder_id = self.kwargs.get('pk')
        folder = generics.get_object_or_404(Folder, id=folder_id)
        return folder

# Document
class DocumentListCreateView(generics.ListCreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DocumentsFilter

    def get_object(self):
        document_id = self.kwargs.get('pk')
        document = generics.get_object_or_404(Document, id=document_id)
        return document
    
    def get_queryset(self):
       if 'folder' in self.request.query_params:
           folder = self.request.query_params['folder']
           return Document.objects.filter(folder=folder)

class DocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Document.objects.all().order_by('created_at')
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        document_id = self.kwargs.get('pk')
        document = generics.get_object_or_404(Document, id=document_id)
        return document

class DocumentLink(generics.RetrieveAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            document = Document.objects.get(pk=kwargs['pk'])
        except Document.DoesNotExist:
            raise FileNotFoundError("Documentul nu a fost găsit")
        path = f"{document.folder.path}/{document.name}"
        return Response({"url": path}, status=status.HTTP_200_OK)

class DocumentDownloadView(generics.RetrieveAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        document = generics.get_object_or_404(Document, pk=kwargs['pk'])
        file_path = os.path.join(document.folder.path, document.name)
        if not os.path.exists(file_path):
            raise Http404("File not found")
        response = FileResponse(open(file_path, 'rb'), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{document.name}"'
        return response
        
class DocumentExtractView(generics.UpdateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        document = Document.objects.get(pk=self.kwargs['pk'])
        content = DocumentSerializer.extract_text(document,request)
        return Response({"extracted_articles": content}, status=status.HTTP_200_OK)

class DocumentGetTextView(generics.UpdateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        document = Document.objects.get(pk=self.kwargs['pk'])
        content = DocumentSerializer.get_text(document)
        return Response({"extracted_articles": content}, status=status.HTTP_200_OK) 

# Bot
class BotListCreateView(generics.ListCreateAPIView):
    queryset = Bot.objects.all()
    serializer_class = BotSerializer
    permission_classes = [IsAuthenticated]

    
class BotDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bot.objects.all()
    serializer_class = BotSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        bot_id = self.kwargs.get('pk')
        bot = generics.get_object_or_404(Bot, id=bot_id)
        return bot


# OpenAISettings
class OpenAISettingsListCreateView(generics.ListCreateAPIView):
    queryset = OpenAISettings.objects.all()
    serializer_class = OpenAISettingsSerializer
    permission_classes = [IsAuthenticated]
    #filter_backends = [DjangoFilterBackend]
    #filterset_fields = OpenAISettingsFilter

    def get_object(self):
        openaisettings_id = self.kwargs.get('pk')
        openaisettings = generics.get_object_or_404(OpenAISettings, id=openaisettings_id)
        return openaisettings

    def get_queryset(self):
        if 'bot' in self.request.query_params:
            bot = self.request.query_params['bot']
            return OpenAISettings.objects.filter(bot=bot)
        
class OpenAISettingsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = OpenAISettings.objects.all().order_by('created_at')
    serializer_class = OpenAISettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        openaisettings_id = self.kwargs.get('pk')
        openaisettings = generics.get_object_or_404(OpenAISettings, id=openaisettings_id)
        return openaisettings

# Article
class ArticleListCreateView(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        document = Document.objects.get(id=self.request.data['document_id'])
        document.increment_articles()
        serializer.save()

    def get_queryset(self):
        mongodb = MongoDBUtils()
        filters = {}

        article_id = self.request.query_params.get('id')
        folder_id = self.request.query_params.get('folder_id')
        document_id = self.request.query_params.get('document_id')

        created_by = self.request.query_params.get('created_by')
        created_by_user = self.request.query_params.get('created_by_user')

        updated_by = self.request.query_params.get('updated_by')
        updated_by_user = self.request.query_params.get('updated_by_user')
        
        if article_id:
            filters['_id'] = ObjectId(article_id)
        if folder_id:
            filters['folder_id'] = int(folder_id)
        if document_id:
            filters['document_id'] = int(document_id)
        if created_by:
            filters['created_by'] = int(created_by)
        if created_by_user:
            filters['created_by_user'] = str(created_by_user)
        if updated_by:
            filters['updated_by'] = int(updated_by)
        if updated_by_user:
            filters['updated_by_user'] = str(updated_by_user)

        return mongodb.find_articles(filters)
    
    def delete(self, request):
        filters = {}
        article_id = self.request.query_params.get('id')
        folder_id = self.request.query_params.get('folder_id')
        document_id = self.request.query_params.get('document_id')
        created_by = self.request.query_params.get('created_by')
        updated_by = self.request.query_params.get('updated_by')

        if article_id:
            filters['_id'] = ObjectId(article_id) 
        if folder_id:
            filters['folder_id'] = int(folder_id)
        if document_id:
            filters['document_id'] = int(document_id)
        if created_by:
            filters['created_by'] = int(created_by)
        if updated_by:
            filters['updated_by'] = int(updated_by)
        if article_id:  
            document_id_to_decrement = MongoDBUtils().find_articles(filters)[0]['document_id']
            Document.objects.get(id=document_id_to_decrement).increment_articles(False)
        delete_count = MongoDBUtils().delete_articles(filters)
        if isinstance(delete_count, dict) and 'error' in delete_count:
            return Response({'error': delete_count['error']}, status=400)
        
        return Response({'deleted_articles': delete_count}, status=200)
    

class ArticleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        article_id = self.kwargs.get('pk')
        article = generics.get_object_or_404(Article, id=article_id)
        return article
    
    def update(self, request, *args, **kwargs):
        filters = {}
        article_id = self.kwargs.get('pk')

        if article_id:
            filters['_id'] = ObjectId(article_id)
        
        update_data = {
            'title': request.data['title'],
            'content': request.data['content'],
            'updated_by': request.user.id,
            'updated_at': datetime.now(),
            'updated_by_user': request.user.username,
        }

        result = MongoDBUtils().update_article(filters, update_data)

        if result.modified_count == 0:
            return Response({'error': 'No articles were updated'}, status=400)
        
        return Response({'updated_article': article_id}, status=200)
    
class ArticleAdvancedSearchView(generics.ListCreateAPIView):
    serializer_class = ArticleSearchSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        query = request.query_params.get('query')
        limit = int(request.query_params.get('limit',5))

        results = MongoDBUtils().advanced_search(query, limit)
        serializer = ArticleSearchSerializer(results, many=True)
        return Response(serializer.data)
    

class ChatbotView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        conversation_id = self.request.query_params.get('conversation_id')
        if conversation_id:
            return Message.objects.filter(conversation__conversation_id=conversation_id).order_by('timestamp')
        return Message.objects.none()

    def create(self, request, *args, **kwargs):
        user_message = request.data.get('message')
        conversation_id = request.data.get('conversation_id')
        prompt_settings = PromptSettings.objects.get(bot=1)

        # daca nu exista o conversatie se creeaza una noua
        if not conversation_id:
            conversation_id = str(uuid4())
        conversation, created = Conversation.objects.get_or_create(conversation_id=conversation_id)

        # daca conversatia este nou creaza un mesaj de bun venit
        if created:
            Message.objects.create(
                conversation=conversation, 
                sender='bot', 
                content=prompt_settings.wellcome_message
                )

        # daca exista deja conversatia se adauga mesajul utilizatorului
        if user_message:
            conversation_history = [
                {"role": "user" if msg.sender == "user" else "assistant", "content": msg.content}
                for msg in Message.objects.filter(conversation=conversation).order_by("timestamp")
            ]
            # salveaza mesajul utilizatorului
            Message.objects.create(conversation=conversation, sender='user', content=user_message)

            try:
                # cauta articole relevante in baza de date MongoDB
                articles = MongoDBUtils().advanced_search(user_message, limit=5)
            except Exception as e:
                print(e)
                articles = [{'title': 'Error', 'content': 'An error occurred while searching for articles.'}]

            # genereaza raspunsul botului folosind OpenAI
            bot_response = OpenAIUtils().generate_response(conversation_history,articles, user_message)

            # salveaza raspunsul botului in baza de date
            Message.objects.create(conversation=conversation, sender='bot', content=bot_response)
        else:
            bot_response = prompt_settings.wellcome_message
        # returneaza raspunsul botului si id-ul conversatiei
        response_data = {
            "conversation_id": conversation.conversation_id,
            "response": bot_response
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class ChatbotWidgetView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        bot_id = request.GET.get('bot_id')
        try:
            uuid_obj = uuid.UUID(bot_id)
        except ValueError:
            return Response({"error": "Invalid bot_id"}, status=400)
        secret_key = request.GET.get('secret_key')
        try:
            bot = Bot.objects.get(bot_id=uuid_obj.hex)
        except Bot.DoesNotExist:
            return Response({"error": "Invalid bot_id"}, status=401)

        if str(secret_key) != str(bot.secret_key):
            return Response({"error": "Invalid bot_id"}, status=401)

        js_file_path = os.path.join(settings.BASE_DIR, 'BotScripts', 'chatbot-widget.js')
        if not os.path.exists(js_file_path):
            return Response({"error": "File not found"}, status=404)

        with open(js_file_path, 'r') as js_file:
            js_content = js_file.read()

        return HttpResponse(js_content, content_type='application/javascript')

class WidgetSettingsListCreateView(generics.ListCreateAPIView):
    queryset = WidgetSettings.objects.all()
    serializer_class = WidgetSettingsSerializer
    permission_classes = [IsAuthenticated]

class WidgetSettingsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = WidgetSettings.objects.all()
    serializer_class = WidgetSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        queryset = self.get_queryset()
        obj= queryset.filter(pk=self.kwargs.get('pk')).first()
        if not obj:
            raise NotFound("WidgetSettings not found")
        return obj
    

class ChatbotWidgetDesignView(generics.RetrieveAPIView):
    queryset = WidgetSettings.objects.all()
    serializer_class = WidgetSettingsSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        bot_id = request.GET.get('bot_id')
        try:
            uuid_obj = uuid.UUID(bot_id)
        except ValueError:
            return Response({"error":"Invalid bot_id"}, status=400)
        secret_key = request.GET.get('secret_key')
        try:
            bot = Bot.objects.get(bot_id=uuid_obj.hex)
        except Bot.DoesNotExist:
            return Response({"error": "Unauthorized"}, status=401)

        if str(secret_key) != str(bot.secret_key):
            return Response({"error": "Unauthorized"}, status=401)

        widget_settings = WidgetSettings.objects.filter(bot=bot).first()

        widget_settings.name = bot.name
    
       # widget_settings.bot = None
       # widget_settings.id = None
       # widget_settings.created_by = None
       # widget_settings.created_at = None
       # widget_settings.updated_by = None
       # widget_settings.updated_at = None

        return Response(WidgetSettingsSerializer(widget_settings).data)
    

class ConversationListView(APIView):
    def get(self, request):
        try:
            # Obține parametrii din query string
            start_datetime = request.query_params.get('start')  # Exemplu: "2024-01-01T10:00:00"
            end_datetime = request.query_params.get('end')  # Exemplu: "2024-01-02T18:00:00"
            conversation_id = request.query_params.get('conversation_id')
            search_query = request.query_params.get('search')  # Exemplu: "facultate"

            # Filtrare pe baza intervalului de timp
            conversations = Conversation.objects.all()

            if start_datetime:
                try:
                    start_datetime = datetime.strptime(start_datetime, "%Y-%m-%dT%H:%M:%S")
                    conversations = conversations.filter(created_at__gte=start_datetime)
                except ValueError:
                    return Response(
                        {"error": "Invalid start datetime format. Use YYYY-MM-DDTHH:MM:SS."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            if end_datetime:
                try:
                    end_datetime = datetime.strptime(end_datetime, "%Y-%m-%dT%H:%M:%S")
                    conversations = conversations.filter(created_at__lte=end_datetime)
                except ValueError:
                    return Response(
                        {"error": "Invalid end datetime format. Use YYYY-MM-DDTHH:MM:SS."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Filtrare după `conversation_id`
            if conversation_id:
                conversations = conversations.filter(conversation_id=conversation_id)

            # Filtrare după conținutul mesajului
            if search_query:
                conversations = conversations.filter(messages__content__icontains=search_query).distinct()

            # Adaugă anotarea pentru primul mesaj al utilizatorului
            conversations = conversations.annotate(
                first_user_message_time=Min('messages__timestamp', filter=Q(messages__sender='user'))
            ).order_by('-created_at')

            # Construcție răspuns
            data = []
            for conv in conversations:
                first_user_message = conv.messages.filter(
                    timestamp=conv.first_user_message_time, sender='user'
                ).first()
                data.append({
                    "conversation_id": conv.conversation_id,
                    "created_at": conv.created_at,
                    "first_user_message": {
                        "sender": first_user_message.sender if first_user_message else None,
                        "content": first_user_message.content if first_user_message else None,
                        "timestamp": first_user_message.timestamp if first_user_message else None,
                    }
                })

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConversationDetailView(APIView):
    def get(self, request, pk):  # Folosește `pk` în loc de `conversation_id`
        try:
            conversation = Conversation.objects.get(conversation_id=pk)
            messages = conversation.messages.order_by('timestamp')

            data = {
                "conversation_id": conversation.conversation_id,
                "messages": [
                    {
                        "sender": message.sender,
                        "content": message.content,
                        "timestamp": message.timestamp
                    } for message in messages
                ]
            }
            return Response(data, status=status.HTTP_200_OK)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)


class PromptSettingsListCreateView(generics.ListCreateAPIView):
    queryset = PromptSettings.objects.all()
    serializer_class = PromptSettingsSerializer
    permission_classes = [IsAuthenticated]

class PromptSettingsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PromptSettings.objects.all()
    serializer_class = PromptSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        queryset = self.get_queryset()
        obj= queryset.filter(pk=self.kwargs.get('pk')).first()
        if not obj:
            raise NotFound("PromptSettings not found")
        return obj

class DashboardStatsView(APIView):
    def get(self, request):
        try:
            # Total conversații
            total_conversations = Conversation.objects.count()

            # Total mesaje
            total_messages = Message.objects.count()

            # Mesaje medii pe conversație
            if total_conversations > 0:
                avg_messages_per_conversation = round(
                    Conversation.objects.annotate(message_count=Count('messages'))
                    .aggregate(average=Avg('message_count'))['average'], 2
                )
            else:
                avg_messages_per_conversation = 0

            # Anotarea duratei conversațiilor
            conversations_with_durations = Conversation.objects.annotate(
                first_message_time=Min('messages__timestamp'),
                last_message_time=Max('messages__timestamp'),
                duration=ExpressionWrapper(
                    F('last_message_time') - F('first_message_time'),
                    output_field=DurationField()
                )
            )

            # Durata medie a conversațiilor
            avg_duration = conversations_with_durations.aggregate(
                average_duration=Avg('duration')
            )['average_duration']

            # Formatarea duratei medii
            if avg_duration:
                total_seconds = avg_duration.total_seconds()
                hours, remainder = divmod(total_seconds, 3600)
                minutes, seconds = divmod(remainder, 60)
                avg_duration_formatted = f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}"
            else:
                avg_duration_formatted = "00:00:00"

            # Gruparea conversațiilor pe intervale de durată
            intervals = {
                'under_5_min': conversations_with_durations.filter(duration__lte=timedelta(minutes=5)).count(),
                'between_5_and_10_min': conversations_with_durations.filter(
                    duration__gt=timedelta(minutes=5),
                    duration__lte=timedelta(minutes=10)
                ).count(),
                'over_10_min': conversations_with_durations.filter(duration__gt=timedelta(minutes=10)).count(),
            }

            # Durata totală a conversațiilor
            total_duration = conversations_with_durations.aggregate(
                total_duration=Sum('duration')
            )['total_duration']
            if total_duration:
                total_seconds = total_duration.total_seconds()
                hours, remainder = divmod(total_seconds, 3600)
                minutes, seconds = divmod(remainder, 60)
                total_duration_formatted = f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}"
            else:
                total_duration_formatted = "00:00:00"

            # Distribuția mesajelor (user vs bot)
            message_distribution = (
                Message.objects.values('sender')
                .annotate(count=Count('id'))
                .order_by('-count')
            )
            distribution = {entry['sender']: entry['count'] for entry in message_distribution}

            # Distribuția temporală a mesajelor (grupare pe ore)
            temporal_intervals = {
                '00-06': Message.objects.filter(timestamp__hour__gte=0, timestamp__hour__lt=6).count(),
                '06-12': Message.objects.filter(timestamp__hour__gte=6, timestamp__hour__lt=12).count(),
                '12-18': Message.objects.filter(timestamp__hour__gte=12, timestamp__hour__lt=18).count(),
                '18-24': Message.objects.filter(timestamp__hour__gte=18, timestamp__hour__lt=24).count(),
            }
             # Conversațiile cu un singur mesaj
            single_message_conversations = Conversation.objects.annotate(message_count=Count('messages')).filter(message_count=1).count()
            
            # Structura răspunsului
            stats = {
                "total_conversations": total_conversations,
                "total_messages": total_messages,
                "avg_messages_per_conversation": avg_messages_per_conversation,
                "avg_duration": avg_duration_formatted,
                "total_duration": total_duration_formatted,
                "conversations_by_duration": intervals,
                "message_distribution": distribution,
                "temporal_intervals": temporal_intervals,
                "single_message_conversations": single_message_conversations,
            }

            return Response(stats, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
