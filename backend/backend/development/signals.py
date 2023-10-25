from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone

from development.models import (
    Development,
    Documentation,
)


@receiver(pre_save, sender=Development)
def update_last_change(sender, instance, **kwargs):
    instance.last_change = timezone.now()


@receiver(pre_save, sender=Documentation)
def update_last_change(sender, instance, **kwargs):
    instance.last_change = timezone.now()
