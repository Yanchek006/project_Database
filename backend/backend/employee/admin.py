from django.contrib import admin

from employee.models import (
    Employee,
    Departament,
    LevelPosition,
    Position
)

models = [
    Employee,
    Departament,
    LevelPosition,
    Position
]

for model in models:
    admin.site.register(model)
