from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.db import models


class Customer(models.Model):
    user: User = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='customer',
        null=False,
    )
    bank_account = models.CharField(
        max_length=20,
        unique=True,
        null=False,
        validators=[
            RegexValidator(
                regex='^[0-9]*$',
                message='Пожалуйста, введите только цифры.',
                code='invalid_numeric_value'
            ),
        ]
    )

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name[0]}, {self.bank_account}'
