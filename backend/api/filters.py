import django_filters
from .models import Document,OpenAISettings

class DocumentsFilter(django_filters.FilterSet):
    folder = django_filters.NumberFilter(field_name='folder')
    class Meta:
        model = Document
        fields = ['folder']

class OpenAISettingsFilter(django_filters.FilterSet):
    bot = django_filters.NumberFilter(field_name='bot')
    class Meta:
        model = OpenAISettings
        fields = ['bot']