from asyncio import log
import os
from django.db import models
from django.contrib.auth.models import User
from .utils.folder_utils import FolderUtils
from .utils.mongodb_utils import MongoDBUtils

# Folder Model
class Folder(models.Model):
    name = models.CharField(max_length=100, unique=True)
    path = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_folders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_folders')
    updated_at = models.DateTimeField(auto_now=True)
    
    def delete(self, *args, **kwargs):
        FolderUtils.delete_folder(self.path)
        MongoDBUtils().delete_articles({'folder_id': self.id})
        super(Folder, self).delete(*args, **kwargs)

    def __str__(self):
        return self.name
    
# Document Model
class Document(models.Model):
    name = models.CharField(max_length=100, unique=True)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name='documents')
    number_of_articles = models.IntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_documents')
    updated_at = models.DateTimeField(auto_now=True)
    
    def delete(self, *args, **kwargs):
        folder = self.folder
        file_path = os.path.join(folder.path, self.name)
        MongoDBUtils().delete_articles({'document_id': self.id})
        if os.path.exists(file_path):
            os.remove(file_path)
        super(Document, self).delete(*args, **kwargs)

    def __str__(self):
        return self.name
    
    def increment_articles(self,increment=True):
        if increment:
            self.number_of_articles += 1
        else:
            self.number_of_articles -= 1
        self.save()

# Bot Model
class Bot(models.Model):
    name = models.CharField(max_length=100)
    bot_id = models.UUIDField(unique=True)
    secret_key = models.UUIDField(unique=True)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_bots')
    created_at = models.DateTimeField(auto_now_add=True)

    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_bots')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# OpenAI Settings Model
class OpenAISettings(models.Model):
    bot = models.OneToOneField(Bot, on_delete=models.CASCADE, related_name='settings')
   
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_settings')
    created_at = models.DateTimeField(auto_now_add=True)
    
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_settings')
    updated_at = models.DateTimeField(auto_now=True)
    
    api_key = models.CharField(max_length=255, default='')
    model = models.CharField(default='gpt-4o-mini', max_length=255)
    max_tokens = models.IntegerField(default=1000)
    temperature = models.FloatField(default=0.0)

    def __str__(self):
        return f"OpenAI Settings ({self.api_key[:10]}...)"
    

class MongoDBManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().using('mongo')

# Article Model
class Article(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_by = models.IntegerField()
    created_by_user = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.IntegerField()
    updated_by_user = models.CharField(max_length=255)
    updated_at = models.DateTimeField(auto_now=True)
    folder_id = models.IntegerField()
    document_id = models.IntegerField()
    
    class Meta:
        db_table = 'articles'
        managed = False

    def save(self, *args, **kwargs):
        new_article = {
            'title': self.title,
            'content': self.content,
            'created_by': self.created_by,
            'created_by_user': self.created_by_user,
            'created_at': self.created_at,
            'updated_by': self.updated_by,
            'updated_by_user': self.updated_by_user,
            'updated_at': self.updated_at,
            'folder_id': self.folder_id,
            'document_id': self.document_id,
        }
        try:
            res = MongoDBUtils().insert_article(new_article)
            log.logger.info(f"Article saved with id: {res}")
            self.id = str(res)
        except Exception as e:
            log.logger.error(f"Failed to save article: {str(e)}")

    def __str__(self):
        return self.title
    
# Conversation Model
class Conversation(models.Model):
    conversation_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.conversation_id

# Message Model
class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    sender = models.CharField(max_length=10)  # 'user' or 'bot'
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.content[:50]}"

# WidgetSettings Model
class WidgetSettings(models.Model):
    name = models.CharField(max_length=255, default='Widget')
    bot = models.ForeignKey(Bot, on_delete=models.CASCADE, related_name='widgets')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_widgets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_widgets')
    updated_at = models.DateTimeField(auto_now=True)
    
    # chat button settings
    chat_button_color = models.CharField(max_length=7, default='#009688')
    chat_button_text = models.CharField(max_length=255, default='💬')
    chat_button_size = models.CharField(max_length=10, default='40px')

    # container settings
    container_width = models.CharField(max_length=10, default='400px')
    container_height = models.CharField(max_length=10, default='500px')

    # header settings
    header_background_color = models.CharField(max_length=7, default='#009688')
    header_text_color = models.CharField(max_length=7, default='#ffffff')
    header_font_size = models.CharField(max_length=10, default='20px')
    header_text_align = models.CharField(max_length=10, default='left')

    # body settings
    body_background_color = models.CharField(max_length=7, default='#ffffff')
    body_text_color = models.CharField(max_length=7, default='#000000')
    body_font_size = models.CharField(max_length=10, default='16px')
    body_user_bubble_color = models.CharField(max_length=7, default='#f0f0f0')
    body_bot_bubble_color = models.CharField(max_length=7, default='#009688')

    # footer settings
    input_placeholder = models.CharField(max_length=255, default='Type a message...')
    input_text_color = models.CharField(max_length=7, default='#000000')
    input_font_size = models.CharField(max_length=10, default='16px')

    send_button_color = models.CharField(max_length=7, default='#009688')
    send_button_text = models.CharField(max_length=255, default='Send')
    send_button_font_size = models.CharField(max_length=10, default='16px')
    send_button_text_color = models.CharField(max_length=7, default='#ffffff')

    def __str__(self):
        return self.name
    
# PromptSettind Model
class PromptSettings(models.Model):
    name = models.CharField(max_length=255)
    bot = models.ForeignKey(Bot, on_delete=models.CASCADE, related_name='prompts')

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_prompts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_prompts')
    updated_at = models.DateTimeField(auto_now=True)

    wellcome_message = models.TextField(default='Hello! How can I help you?')
    company = models.CharField(max_length=255, default='Company Name')
    domain = models.CharField(max_length=255, default='general')
    subdomain = models.CharField(max_length=255, default='general')
    tone = models.CharField(max_length=255, default='neutral')
    max_words = models.IntegerField(default=100)
    detail_level = models.CharField(max_length=255, default='clarificare')
    audience_level = models.CharField(max_length=255, default='începător')
    multi_language = models.CharField(max_length=255, default='română')
    accept_simple_chat = models.BooleanField(default=False)

    def __str__(self):
        return self.name