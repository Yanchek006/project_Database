from django.db import models
from django.utils import timezone

from employee.models import Employee
from request.models import Request, State


class Development(models.Model):
    employees: list[Employee] = models.ManyToManyField(
        Employee,
        related_name='developments',
    )
    request: Request = models.OneToOneField(
        Request,
        related_name='developments',
        null=False,
        on_delete=models.CASCADE,
    )
    state: State = models.ForeignKey(
        State,
        related_name='developments',
        null=False,
        on_delete=models.CASCADE,
    )

    start_time = models.DateTimeField(default=timezone.now)
    last_change = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Заказчик: {self.request.customer}, описание: {self.request.description}'

    def save(self, *args, **kwargs):
        self.last_change = timezone.now()
        super().save(*args, **kwargs)


class Documentation(models.Model):
    development: Development = models.ForeignKey(
        Development,
        related_name='documentations',
        null=False,
        on_delete=models.CASCADE,
    )
    state: State = models.ForeignKey(
        State,
        related_name='documentations',
        null=False,
        on_delete=models.CASCADE,
    )
    employees: list[Employee] = models.ManyToManyField(
        Employee,
        related_name='documentations',
    )
    create_time = models.DateTimeField(default=timezone.now)
    last_change = models.DateTimeField(default=timezone.now)
    text = models.TextField(null=False)

    def __str__(self):
        return f'Документация к разработке с id: {self.development.pk}'

    def save(self, *args, **kwargs):
        self.last_change = timezone.now()
        super().save(*args, **kwargs)
