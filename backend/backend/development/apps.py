from django.apps import AppConfig


class DevelopmentConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "development"

    def ready(self):
        import development.signals
