from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.conf import settings


class Command(BaseCommand):
    help = "Create a superuser"

    def handle(self, *args, **kwargs):
        if not User.objects.filter(
            username=settings.DJANGO_SUPERUSER_USERNAME
        ).exists():
            User.objects.create_superuser(
                username=settings.DJANGO_SUPERUSER_USERNAME,
                email=settings.DJANGO_SUPERUSER_EMAIL,
                password=settings.DJANGO_SUPERUSER_PASSWORD,
            )
            self.stdout.write(self.style.SUCCESS("Superuser created successfully"))
        else:
            self.stdout.write(self.style.WARNING("Superuser already exists"))
