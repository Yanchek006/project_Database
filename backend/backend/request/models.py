from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from customer.models import Customer
from employee.models import Employee
from employee.signals import DefaultPosition


class State(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        null=False,
    )

    def __str__(self):
        return f'{self.name}'


class PriceList(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        null=False,
    )
    price = models.DecimalField(
        max_digits=20,
        decimal_places=2,
        null=False,
    )

    def __str__(self):
        return f'{self.name}'


class Request(models.Model):
    description = models.TextField(null=False)
    create_time = models.DateTimeField(default=timezone.now)
    state: State = models.ForeignKey(
        State,
        on_delete=models.CASCADE,
        related_name='requests',
        null=False,
    )
    price_list: PriceList = models.ForeignKey(
        PriceList,
        on_delete=models.CASCADE,
        related_name='requests',
        null=False,
    )
    customer: Customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='requests',
        null=False,
    )
    manager: Employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='requests',
        null=False,
    )

    def __str__(self):
        return (f'Менеджер данной заявки: {self.manager.user.first_name} {self.manager.user.last_name[0]}, '
                f'заказчик: {self.customer.user.first_name} {self.customer.user.last_name[0]}, '
                f'описание: {self.description}')

    def clean(self):
        super().clean()
        if self.manager and self.manager.position.name != DefaultPosition.manager:
            raise ValidationError('Сотрудником для заявки может быть только менеджер.')
