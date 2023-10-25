from django.contrib.auth.models import User
from django.db import models


class Position(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        null=False,
    )

    def __str__(self):
        return f'{self.name}'


class Departament(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        null=False,
    )
    address = models.CharField(
        max_length=255,
        unique=True,
        null=False,
    )

    def __str__(self):
        return f'{self.name}'


class LevelPosition(models.Model):
    name = models.CharField(
        max_length=100,
        null=False,
    )
    coefficient_salary = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=False,
    )

    def __str__(self):
        return f'{self.name}'


class Employee(models.Model):
    user: User = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='employee',
        null=False,
    )
    departament: Departament = models.ForeignKey(
        Departament,
        on_delete=models.CASCADE,
        related_name='employees',
        null=False,
    )
    position: Position = models.ForeignKey(
        Position,
        on_delete=models.CASCADE,
        related_name='employees',
        null=False,

    )
    level_position: LevelPosition = models.ForeignKey(
        LevelPosition,
        on_delete=models.CASCADE,
        related_name='employees',
        null=False,
    )

    salary = models.DecimalField(
        max_digits=20,
        decimal_places=2,
        null=False,
    )

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name[0]}. на позиции: {self.position.name}'
