# Generated by Django 5.1.1 on 2024-10-16 19:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_input_color_bot_input_text_color_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bot',
            name='bot_id',
            field=models.UUIDField(unique=True),
        ),
        migrations.AlterField(
            model_name='bot',
            name='secret_key',
            field=models.UUIDField(unique=True),
        ),
    ]
