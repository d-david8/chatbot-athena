# Generated by Django 5.1.7 on 2025-05-01 13:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_promptsettings'),
    ]

    operations = [
        migrations.AddField(
            model_name='promptsettings',
            name='company',
            field=models.CharField(default='Company Name', max_length=255),
        ),
    ]
