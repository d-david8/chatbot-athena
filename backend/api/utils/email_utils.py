from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings

class EmailUtils:
    @staticmethod
    def send_email(subject, message, recipient_list, html_message=None):
        """
        Trimite un email simplu sau HTML.
        """
        email = EmailMessage(
            subject=subject,
            body=message,
            from_email=settings.EMAIL_HOST_USER,
            to=recipient_list,
        )
        if html_message:
            email.content_subtype = "html"  # Specifică că emailul este HTML
            email.body = html_message

        email.send()

    @staticmethod
    def send_welcome_email(user_first_name, user_name, user_email, user_password):
        subject = "Bun venit în Athena - Contul tău a fost creat!"
        html_message = render_to_string("emails/welcome_email.html", {
            "user_first_name": user_first_name,
            "user_name": user_name,
            "user_password": user_password,
            "login_url": "http://localhost:5173/login"
        })
        EmailUtils.send_email(
            subject=subject,
            message="",
            recipient_list=[user_email],
            html_message=html_message
        )
    @staticmethod
    def send_reset_password_email(user_first_name, user_email, new_password):
        subject = "Resetare parolă Athena"
        html_message = render_to_string("emails/reset_password_email.html", {
            "user_first_name": user_first_name,
            "new_password": new_password,
            "login_url": "http://localhost:5173/login"
        })
        EmailUtils.send_email(
            subject=subject,
            message="",
            recipient_list=[user_email],
            html_message=html_message
        )