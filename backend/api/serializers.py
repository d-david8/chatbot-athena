from asyncio import log
from datetime import datetime
import uuid
from bson import ObjectId
from django.contrib.auth.models import User
from rest_framework import serializers
from pathlib import Path

from .models import Folder, Document, Bot, OpenAISettings, Article, Message, Conversation, WidgetSettings, PromptSettings
from .utils.email_utils import EmailUtils
from .utils.folder_utils import FolderUtils
from .utils.open_ai_utils import OpenAIUtils
from .utils.document_utils import DocumentUtils
from .utils.mongodb_utils import MongoDBUtils
from .utils.password_utils import PasswordUtils

# USER SERIALIZER
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_superuser']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        random_password = PasswordUtils.generate_random_password()
        validated_data['password']= random_password
        user = User.objects.create_user(**validated_data)
        EmailUtils.send_welcome_email(user.first_name, user.username,user.email, random_password)
        user.save()
        return user

# FOLDER SERIALIZER
class FolderSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True) 
    updated_by = serializers.PrimaryKeyRelatedField(read_only=True) 
    created_by_user = serializers.SerializerMethodField()
    updated_by_user= serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = ['id', 'name', 'path', 'created_by','created_by_user', 'created_at', 'updated_by','updated_by_user','updated_at']

    def create(self, validated_data):
        user = self.context['request'].user

        folder_name = validated_data['name']
        folder_path = FolderUtils.create_folder(folder_name)

        folder = Folder(
            name=folder_name,
            path=folder_path,
            created_by=user,
            updated_by=user
        )
        folder.save()
        return folder

    def update(self, instance, validated_data):
        user = self.context['request'].user

        new_name = validated_data.get('name', instance.name)
        if new_name != instance.name:
            instance.path = FolderUtils.rename_folder(instance.name, new_name)
        else:
            return serializers.ValidationError("Folder name cannot be the same", code=400)
        
        instance.name = new_name
        instance.updated_by = user
        instance.save()
        return instance
    
    def get_created_by_user(self, obj):
        return obj.created_by.username
    
    def get_updated_by_user(self, obj):
        return obj.updated_by.username


# DOCUMENT SERIALIZER
class DocumentSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    updated_by = serializers.PrimaryKeyRelatedField(read_only=True)
    folder = serializers.PrimaryKeyRelatedField(queryset=Folder.objects.all(), required=False)
    created_by_user = serializers.SerializerMethodField()
    updated_by_user= serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id','folder', 'name', 'created_by', 'created_by_user','created_at', 'updated_by','updated_by_user','updated_at', 'number_of_articles']

    def get_created_by_user(self, obj):
        return obj.created_by.username
    
    def get_updated_by_user(self, obj):
        return obj.updated_by.username

    def create(self, validated_data):
        user = self.context['request'].user
        folder = validated_data.get('folder')
        if folder is None:
            raise serializers.ValidationError({"folder": "This field is required."})
        
        name = validated_data['name']
        file = self.context['request'].FILES.get('file')
        if file is None:
            raise serializers.ValidationError({"file": "This field is required."})
        
        extension = Path(file.name).suffix
    
        if not Folder.objects.filter(id=folder.id).exists():
            raise serializers.ValidationError("Folder does not exist", code=400)
        
        if not name.endswith(extension):
            name = f"{name}{extension}"
    
        if Document.objects.filter(name=name, folder=folder).exists():
            raise serializers.ValidationError(f"Document {name} already exists in folder {folder.name}", code=400)
        
        file_path = Path(f"{folder.path}/{name}")
        file_path.write_bytes(file.read())
        
        document = Document(
            name=name,
            folder=folder,
            created_by=user,
            updated_by=user
        )
        document.save()
        return document
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        name = validated_data.get('name', instance.name)
        number_of_articles = validated_data.get('number_of_articles', instance.number_of_articles)
        
        if name == instance.name:
            return serializers.ValidationError("Document name cannot be the same", code=400)
        
        extension = Path(instance.name).suffix
        if not name.endswith(extension):
            name = f"{name}{extension}"
        
        old_path = Path(f"{instance.folder.path}/{instance.name}")
        new_path = Path(f"{instance.folder.path}/{name}")
        
        try:
            old_path.rename(new_path)
        except Exception as e:
            raise serializers.ValidationError(f"Error renaming file: {e}", code=500)
        
        instance.name = name
        instance.updated_by = user
        instance.number_of_articles = number_of_articles
        instance.save()
        return instance
        
    def extract_text(self, request):
        document_path = f"{self.folder.path}/{self.name}"
        document_id = self.id
        folder_id = self.folder.id

        if not Path(document_path).exists():
            raise serializers.ValidationError("File does not exist", code=400)
    
        if not OpenAISettings.objects.filter(bot=1).exists():
            raise serializers.ValidationError("OpenAI settings not found", code=400)
        
        try:
            content_list = DocumentUtils.extract_text_from_file(document_path)
            log.logger.info(content_list)
            article_list = OpenAIUtils.extract_articles(content_list, request.user.id, request.user.username, folder_id, document_id)
            mongo_utils = MongoDBUtils()
            log.logger.info("MongoDB connection established")
            log.logger.info(article_list)
            res = mongo_utils.insert_articles(article_list)
        except Exception as e:
            raise serializers.ValidationError(f"Error extracting text: {e}", code=500)

        self.number_of_articles = res
        self.updated_by = request.user
        self.save()
        return res
    
    # get text from file
    def get_text(self):
        document_path = f"{self.folder.path}/{self.name}"
        if not Path(document_path).exists():
            raise serializers.ValidationError("File does not exist", code=400)
        
        try:
            content = DocumentUtils.extract_text_from_file(document_path)
        except Exception as e:
            raise serializers.ValidationError(f"Error extracting text: {e}", code=500)
        
        return content
    
# BOT SERIALIZER 
class BotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bot
        fields = ['id', 'name', 'bot_id','secret_key','created_by','created_at','updated_by','updated_at']
        read_only_fields = ['bot_id','secret_key','created_by','created_at','updated_by','updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        bot = Bot(
            name=validated_data['name'],
            created_by=user,
            updated_by=user,
            bot_id=uuid.uuid4().hex,
            secret_key=uuid.uuid4().hex,
        )
        bot.save()
        return bot

# OPENAI SETTINGS SERIALIZER
class OpenAISettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpenAISettings
        fields = ['id','bot','model', 'api_key', 'temperature','max_tokens','created_by','created_at','updated_by','updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        settings = OpenAISettings(
            bot=validated_data['bot'],
            api_key=validated_data['api_key'],
            model=validated_data['model'],
            max_tokens=validated_data['max_tokens'],
            temperature=validated_data['temperature'],
            created_by=user,
            updated_by=user
        )
        settings.save()
        return settings
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        instance.api_key = validated_data.get('api_key', instance.api_key)
        instance.model = validated_data.get('model', instance.model)
        instance.max_tokens = validated_data.get('max_tokens', instance.max_tokens)
        instance.temperature = validated_data.get('temperature', instance.temperature)
        instance.updated_by = user
        instance.save()
        return instance
    

# ARTICLE SERIALIZER

class ArticleSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'created_by','created_by_user', 'created_at', 'updated_by','updated_by_user', 'updated_at', 'folder_id', 'document_id']
        read_only_fields = ['created_by', 'created_by_user', 'updated_by', 'updated_by_user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        user = self.context['request'].user
        article = Article(
            title = validated_data['title'],
            content = validated_data['content'],
            created_at = datetime.now(),
            updated_at = datetime.now(),

            created_by = user.id,
            created_by_user = user.username,

            updated_by = user.id,
            updated_by_user = user.username,

            document_id = validated_data['document_id'],
            folder_id = validated_data['folder_id'],
        )
        article.save()
        return article
    
    def get_id(self, obj):
        if isinstance(obj, dict):
            _id = obj.get('_id')
            return str(_id) if isinstance(_id, ObjectId) else _id
    # În caz că este un obiect Django
        return str(getattr(obj, 'id', ''))
    
    


# Advanced Search Serializer
class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        if isinstance(value, ObjectId):
            return str(value)  # Convertim ObjectId la string
        return value
    
class ArticleSearchSerializer(serializers.Serializer):
    id = ObjectIdField(source='_id', read_only=True)
    title = serializers.CharField(required=False, max_length=255)
    content = serializers.CharField(required=False, max_length=255)
    score = serializers.FloatField(read_only=True)

    class Meta:
        fields = ['id', 'title', 'content', 'score']
    

# Message Serializer
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['sender', 'content', 'timestamp']

# Conversation Serializer
class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['conversation_id', 'created_at', 'messages']

class WidgetSettingsSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    updated_by = serializers.PrimaryKeyRelatedField(read_only=True)
    bot = serializers.PrimaryKeyRelatedField(queryset=Bot.objects.all(), required=False)
    
    class Meta:
        model = WidgetSettings
        fields = [
            'id',
            'name',
            'bot',
            'created_by',
            'created_at',
            'updated_by',
            'updated_at',
            'chat_button_color',
            'chat_button_text',
            'chat_button_size',
            'container_width',
            'container_height',
            'header_background_color',
            'header_text_color',
            'header_font_size',
            'header_text_align',
            'body_background_color',
            'body_text_color',
            'body_font_size',
            'body_user_bubble_color',
            'body_bot_bubble_color',
            'input_placeholder',
            'input_text_color',
            'input_font_size',
            'send_button_color',
            'send_button_text',
            'send_button_font_size',
            'send_button_text_color',
        ]
    
    def create(self, validated_data):
        user = self.context['request'].user
        bot = validated_data.get('bot')
        if bot is None:
            raise serializers.ValidationError({"bot": "This field is required."})
        if self.Meta.model.objects.filter(bot=bot).exists():
            raise serializers.ValidationError({"error":"Widget settings already exist for this bot"}, code=400)
        validated_data['created_by'] = user
        validated_data['updated_by'] = user
        validated_data['name'] = f"{bot.name} Widget"
        validated_data['created_at'] = datetime.now()
        validated_data['updated_at'] = datetime.now()

        return WidgetSettings.objects.create(**validated_data)


# PromptSettings Serializer
class PromptSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromptSettings
        fields = [
            'id', 
            'bot', 
            'name', 
            'created_by', 
            'created_at',
            'updated_by',
            'updated_at',
            'wellcome_message',
            'company',
            'domain',
            'subdomain',
            'tone',
            'max_words',
            'detail_level',
            'audience_level',
            'multi_language',
            'accept_simple_chat',
        ]
    def create(self, validated_data):
        user = self.context['request'].user
        bot = validated_data.get('bot')
        if bot is None:
            raise serializers.ValidationError({"bot": "This field is required."})
        if self.Meta.model.objects.filter(bot=bot).exists():
            raise serializers.ValidationError({"error":"Prompt settings already exist for this bot"}, code=400)
        validated_data['created_by'] = user
        validated_data['updated_by'] = user
        validated_data['name'] = f"{bot.name} Prompt"
        validated_data['created_at'] = datetime.now()
        validated_data['updated_at'] = datetime.now()

        return PromptSettings.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        instance.updated_by = user
        instance.updated_at = datetime.now()
        return super().update(instance, validated_data)
    